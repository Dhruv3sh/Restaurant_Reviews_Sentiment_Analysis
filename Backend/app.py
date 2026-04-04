from flask import Flask, request, jsonify
from flask_cors import CORS
import joblib, re, nltk
from nltk.corpus import stopwords
from nltk.stem import WordNetLemmatizer

nltk.download('stopwords')
nltk.download('wordnet')
nltk.download('omw-1.4')

app = Flask(__name__)
CORS(app)

# Load model and vectorizer
model = joblib.load("model.pkl")
vectorizer = joblib.load("vectorizer.pkl")

# Contractions dictionary
contractions_dict = {
    "can't": "can not", "won't": "will not", "isn't": "is not",
    "wasn't": "was not", "weren't": "were not", "haven't": "have not",
    "hasn't": "has not", "didn't": "did not", "don't": "do not",
    "doesn't": "does not", "aren't": "are not", "couldn't": "could not",
    "shouldn't": "should not", "wouldn't": "would not"
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
    text = expand_contractions(text)
    text = re.sub(r'[^a-zA-Z\s]', '', text).lower()
    words = text.split()
    clean_words = [lemmatizer.lemmatize(w) for w in words if w not in stop_words]
    final_words = []
    for i in range(len(clean_words)):
        if i == 0 or clean_words[i] != clean_words[i-1]:
            final_words.append(clean_words[i])
    return ' '.join(final_words)

@app.route('/predict', methods=['POST'])
def predict():
    data = request.get_json()
    review = data.get('review', '')

    if not review.strip():
        return jsonify({'error': 'Review text is empty'}), 400

    cleaned = clean_review(review)
    vectorized = vectorizer.transform([cleaned]).toarray()
    prediction = model.predict(vectorized)[0]

    return jsonify({
        'sentiment': 'Positive' if prediction == 1 else 'Negative',
        'label': int(prediction)
    })

@app.route('/health', methods=['GET'])
def health():
    return jsonify({'status': 'Flask is running!'})

if __name__ == '__main__':
    app.run(debug=True, port=5000)