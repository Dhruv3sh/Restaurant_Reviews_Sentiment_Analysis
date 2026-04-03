# train_and_save (run once)
import joblib, re
import pandas as pd
from nltk.corpus import stopwords
from nltk.stem import PorterStemmer
from sklearn.feature_extraction.text import CountVectorizer
from sklearn.svm import SVC

data = pd.read_csv('Restaurant_Reviews.tsv', sep='\t')
data.drop_duplicates(inplace=True)

ps = PorterStemmer()
sw = set(stopwords.words('english'))

def preprocess(text):
    s = re.sub('[^a-zA-Z]', ' ', text).lower().split()
    s = [w for w in s if w not in sw]
    return ps.stem(' '.join(s))

corpus = [preprocess(r) for r in data['Review']]
vectorizer = CountVectorizer()
X = vectorizer.fit_transform(corpus).toarray()
y = data['Liked']

model = SVC()
model.fit(X, y)

joblib.dump(model, 'model.pkl')
joblib.dump(vectorizer, 'vectorizer.pkl')