from flask import Flask, request, jsonify
from flask_cors import CORS
import joblib, re, nltk
from nltk.corpus import stopwords
from nltk.stem import WordNetLemmatizer

import nltk

try:
    nltk.data.find('corpora/stopwords')
except LookupError:
    nltk.download('stopwords')

app = Flask(__name__)
CORS(app)

model = joblib.load("model.pkl")
vectorizer = joblib.load("vectorizer.pkl")

contractions_dict = {
    "can't": "can not", "won't": "will not", "isn't": "is not",
    "wasn't": "was not", "weren't": "were not", "haven't": "have not",
    "hasn't": "has not", "didn't": "did not", "don't": "do not",
    "doesn't": "does not", "aren't": "are not", "couldn't": "could not",
    "shouldn't": "should not", "wouldn't": "would not"
}

POSITIVE_KEYWORDS = {
    "food": ["delicious", "tasty", "amazing", "fresh", "flavourful", "yummy",
             "great", "excellent", "wonderful", "incredible", "good", "nice",
             "fantastic", "perfect", "lovely", "outstanding", "superb"],
    "service": ["friendly", "attentive", "polite", "helpful", "quick", "fast",
                "efficient", "welcoming", "professional", "warm", "courteous"],
    "ambience": ["cozy", "clean", "comfortable", "beautiful", "pleasant",
                 "relaxing", "charming", "spacious", "elegant", "nice"],
    "value": ["affordable", "cheap", "reasonable", "worth", "value", "generous", "large", "big"]
}

NEGATIVE_KEYWORDS = {
    "food": ["bland", "cold", "stale", "bad", "disgusting", "awful", "terrible",
             "horrible", "undercooked", "overcooked", "raw", "tasteless", "worst"],
    "service": ["slow", "rude", "unfriendly", "poor", "unprofessional", "terrible",
                "horrible", "inattentive", "dismissive", "awful", "lazy"],
    "ambience": ["dirty", "noisy", "crowded", "uncomfortable", "smelly", "messy",
                 "dark", "congested", "chaotic", "unpleasant"],
    "value": ["expensive", "overpriced", "pricey", "small", "tiny", "little"]
}

lemmatizer = WordNetLemmatizer()
stop_words = stopwords.words('english')
stop_words.remove('not')

def expand_contractions(text):
    for word in text.split():
        if word.lower() in contractions_dict:
            text = text.replace(word, contractions_dict[word.lower()])
    return text

def clean_review(text):
    text = expand_contractions(str(text))
    text = re.sub(r'[^a-zA-Z\s]', '', text).lower()
    words = text.split()
    clean_words = [lemmatizer.lemmatize(w) for w in words if w not in stop_words]
    final_words = []
    for i in range(len(clean_words)):
        if i == 0 or clean_words[i] != clean_words[i-1]:
            final_words.append(clean_words[i])
    return ' '.join(final_words)

def extract_keywords(text):
    words = re.sub(r'[^a-zA-Z\s]', '', text.lower()).split()
    found_positive = {}
    found_negative = {}
    for category, keywords in POSITIVE_KEYWORDS.items():
        matches = [w for w in words if w in keywords]
        if matches:
            found_positive[category] = matches
    for category, keywords in NEGATIVE_KEYWORDS.items():
        matches = [w for w in words if w in keywords]
        if matches:
            found_negative[category] = matches
    return found_positive, found_negative

def predict_single(review_text):
    cleaned = clean_review(review_text)
    vectorized = vectorizer.transform([cleaned]).toarray()
    prediction = model.predict(vectorized)[0]
    return 'Positive' if prediction == 1 else 'Negative'

def generate_bulk_summary(restaurant_name, total, positive_count, negative_count, all_positive_kw, all_negative_kw):
    positive_pct = round((positive_count / total) * 100)
    negative_pct = 100 - positive_pct

    # Build keyword mentions
    good_aspects = []
    bad_aspects = []

    for category, words in all_positive_kw.items():
        top = list(set(words))[:3]
        good_aspects.append(f"{category} ({', '.join(top)})")

    for category, words in all_negative_kw.items():
        top = list(set(words))[:3]
        bad_aspects.append(f"{category} ({', '.join(top)})")

    # Build summary paragraph
    if positive_pct >= 70:
        overall = f"{restaurant_name} is highly rated by customers"
    elif positive_pct >= 50:
        overall = f"{restaurant_name} has mixed but mostly positive reviews"
    else:
        overall = f"{restaurant_name} has received mostly negative feedback"

    summary = f"{overall}, with {positive_pct}% positive and {negative_pct}% negative sentiment across {total} reviews analyzed."

    if good_aspects:
        summary += f" Customers frequently praised the {' and '.join(good_aspects)}."

    if bad_aspects:
        summary += f" However, there were complaints about the {' and '.join(bad_aspects)}."

    if not good_aspects and not bad_aspects:
        if positive_pct >= 70:
            summary += " Overall, guests had a great experience."
        else:
            summary += " Overall, guests were not satisfied with their experience."

    return summary

@app.route('/predict', methods=['POST'])
def predict():
    data = request.get_json()
    review = data.get('review', '')
    if not review.strip():
        return jsonify({'error': 'Review text is empty'}), 400
    cleaned = clean_review(review)
    vectorized = vectorizer.transform([cleaned]).toarray()
    prediction = model.predict(vectorized)[0]
    sentiment = 'Positive' if prediction == 1 else 'Negative'
    found_positive, found_negative = extract_keywords(review)
    return jsonify({
        'sentiment': sentiment,
        'label': int(prediction),
        'highlights': {'positive': found_positive, 'negative': found_negative}
    })

@app.route('/analyze-reviews', methods=['POST'])
def analyze_reviews():
    data = request.get_json()
    reviews = data.get('reviews', [])
    restaurant_name = data.get('restaurant_name', 'This restaurant')

    if not reviews:
        return jsonify({'error': 'No reviews provided'}), 400

    positive_count = 0
    negative_count = 0
    all_positive_kw = {}
    all_negative_kw = {}
    analyzed = []

    for review in reviews:
        text = review.get('snippet') or review.get('review_text') or ''
        if not text.strip():
            continue

        sentiment = predict_single(text)
        found_positive, found_negative = extract_keywords(text)

        if sentiment == 'Positive':
            positive_count += 1
        else:
            negative_count += 1

        # Accumulate keywords
        for cat, words in found_positive.items():
            all_positive_kw.setdefault(cat, []).extend(words)
        for cat, words in found_negative.items():
            all_negative_kw.setdefault(cat, []).extend(words)

        analyzed.append({
            'text': text[:100] + '...' if len(text) > 100 else text,
            'sentiment': sentiment
        })

    total = positive_count + negative_count
    if total == 0:
        return jsonify({'error': 'No valid review text found'}), 400

    summary = generate_bulk_summary(
        restaurant_name, total,
        positive_count, negative_count,
        all_positive_kw, all_negative_kw
    )

    return jsonify({
        'summary': summary,
        'total': total,
        'positive_count': positive_count,
        'negative_count': negative_count,
        'analyzed': analyzed
    })

@app.route('/health', methods=['GET'])
def health():
    return jsonify({'status': 'Flask is running!'})

if __name__ == '__main__':
    app.run(debug=True, port=5000)