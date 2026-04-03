from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import joblib, re, nltk
from nltk.corpus import stopwords
from nltk.stem import PorterStemmer

nltk.download('stopwords', quiet=True)

app = FastAPI()
app.add_middleware(CORSMiddleware, allow_origins=["*"], allow_methods=["*"], allow_headers=["*"])

try:
    model = joblib.load('model.pkl')
    vectorizer = joblib.load('vectorizer.pkl')
except FileNotFoundError as e:
    raise RuntimeError(f"Model file not found: {e}")

ps = PorterStemmer()
sw = set(stopwords.words('english'))

def preprocess(text: str) -> str:
    tokens = re.sub('[^a-zA-Z]', ' ', text).lower().split()
    tokens = [ps.stem(w) for w in tokens if w not in sw]
    return ' '.join(tokens)

class ReviewIn(BaseModel):
    review: str

@app.post('/predict')
def predict(body: ReviewIn):
    if not body.review.strip():
        raise HTTPException(status_code=400, detail="Review text cannot be empty")

    cleaned = preprocess(body.review)
    vec = vectorizer.transform([cleaned]).toarray()
    pred = model.predict(vec)[0]

    return {
        "sentiment": "positive" if pred == 1 else "negative",
        "label": int(pred)
    }