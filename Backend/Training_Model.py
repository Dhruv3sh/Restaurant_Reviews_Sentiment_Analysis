# training model
import joblib, re, nltk
import pandas as pd
from nltk.corpus import stopwords
from nltk.stem.porter import PorterStemmer
from nltk.stem import WordNetLemmatizer
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.ensemble import RandomForestClassifier
from sklearn.model_selection import train_test_split

nltk.download('stopwords')
nltk.download('wordnet')
nltk.download('omw-1.4')

# Load data
df = pd.read_csv('Restaurant_Reviews.tsv', sep='\t')
df['Liked'] = df['Liked'].fillna(0)
df = df.fillna(0)

# Contractions
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

# Preprocess
corpus = df['Review'].apply(clean_review).tolist()

# Vectorize
tfidf = TfidfVectorizer(max_features=2000, ngram_range=(1, 3))
X = tfidf.fit_transform(corpus).toarray()
y = df['Liked'].values

# Train
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.30, random_state=42)
classifier = RandomForestClassifier(n_estimators=300, criterion='entropy', random_state=42)
classifier.fit(X_train, y_train)

# Save
joblib.dump(classifier, 'model.pkl')
joblib.dump(tfidf, 'vectorizer.pkl')

print("✅ model.pkl and vectorizer.pkl saved successfully!")