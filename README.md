# 🍽️ Restaurant Sentiment Analysis Dashboard

A full-stack AI-powered web application that fetches real Google Maps reviews for any restaurant and analyzes their sentiment using a custom-trained Machine Learning model — deployed on **Vercel** (frontend) and **Render** (backend).

---
## 🎥 Video Walkthrough

> [![Video Title](https://img.youtube.com/vi/Qk-0I0tDEoo/0.jpg)](https://www.youtube.com/watch?v=Qk-0I0tDEoo)

> - The video covers:
> - Searching for any restaurant by name and location
> - Live review fetching from Google Maps via SerpAPI
> - AI sentiment analysis (Positive / Negative classification)
> - Rating distribution chart and restaurant gallery
> - Dark / Light mode toggle

---

## ✨ Features

- 🔍 **Live restaurant search** — fetches real reviews from Google Maps using SerpAPI
- 🤖 **AI sentiment analysis** — custom Random Forest model trained on restaurant review data
- 📊 **Rating distribution chart** — visual breakdown of 1–5 star reviews using Recharts
- 💬 **Keyword extraction** — identifies positive/negative aspects (food, service, ambience, value)
- 🗺️ **Location map** — embedded Google Maps iframe for every restaurant
- 🖼️ **Restaurant gallery** — high-res cover image from Google profile
- 🌙 **Dark / Light mode** — persisted theme toggle
- ⚡ **Production-ready** — CORS-configured Flask backend, Gunicorn server, environment-based config

---

## 🛠️ Tech Stack

### Frontend
| Technology | Purpose |
|---|---|
| React 18 | UI framework |
| Vite | Build tool and dev server |
| React Router v6 | Client-side routing |
| Recharts | Rating distribution bar chart |
| Lucide React | Icon library |
| Tailwind CSS | Utility-first styling |
| Context API | Global state management |

### Backend
| Technology | Purpose |
|---|---|
| Python 3.10+ | Runtime |
| Flask | Web framework |
| Flask-CORS | Cross-origin request handling |
| Gunicorn | Production WSGI server |
| scikit-learn | Random Forest classifier |
| NLTK | Text preprocessing (lemmatization, stopwords) |
| TF-IDF Vectorizer | Feature extraction from review text |
| joblib | Model serialization |

### External APIs
| Service | Purpose |
|---|---|
| SerpAPI | Google Maps search + review fetching |

### Deployment
| Platform | What runs there |
|---|---|
| Vercel | React frontend |
| Render | Flask backend + ML model |

---

## 🗂️ Project Structure

```
root/
├── Frontend/
│   ├── public/
│   ├── src/
│   │   ├── Components/
│   │   │   ├── ActivityRow.jsx
│   │   │   ├── Layout.jsx
│   │   │   └── StatCard.jsx
│   │   ├── Context/
│   │   │   ├── ReviewContext.js
│   │   │   ├── ReviewProvider.jsx
│   │   │   └── ThemeContext.jsx
│   │   ├── Pages/
│   │   │   ├── Home.jsx
│   │   │   └── Reviews.jsx
│   │   ├── Constants/
│   │   │   └── index.js
│   │   └── App.jsx
│   ├── vercel.json
│   ├── .env
│   ├── vite.config.js
│   └── package.json
│
└── Backend/
    ├── app.py
    ├── train_and_save.py
    ├── model.pkl
    ├── vectorizer.pkl
    ├── Restaurant_Reviews.tsv
    ├── requirements.txt
    └── render.yaml
```

---

## ⚙️ How the ML Model Works

1. **Dataset** — `Restaurant_Reviews.tsv` (1000 labeled reviews, 0 = Negative, 1 = Positive)
2. **Preprocessing** — contraction expansion → punctuation removal → lowercasing → lemmatization → stopword removal (keeping "not")
3. **Vectorization** — TF-IDF with `max_features=2000`, `ngram_range=(1,3)`
4. **Model** — Random Forest with 300 estimators, entropy criterion
5. **Accuracy** — ~80%+ on 30% test split
6. **Keyword extraction** — rule-based matching across food, service, ambience, and value categories

---

## 🚀 Running Locally

### Prerequisites

- Node.js 18+
- Python 3.10+
- A [SerpAPI](https://serpapi.com/) account and API key

---

### 1. Clone the repository

```bash
git clone https://github.com/your-username/restaurant-sentiment-analysis.git
cd restaurant-sentiment-analysis
```

---

### 2. Backend setup

```bash
cd Backend
pip install -r requirements.txt
```

Download required NLTK data (first time only):
```bash
python -c "import nltk; nltk.download('stopwords'); nltk.download('wordnet'); nltk.download('omw-1.4')"
```

Train the model (only needed once — skip if `model.pkl` and `vectorizer.pkl` already exist):
```bash
python Training_Model.py
```

Run the Flask server:
```bash
python app.py
```

Backend will be running at `http://localhost:5000`

Test it:
```bash
curl http://localhost:5000/health
# → {"status": "Flask is running!"}
```

---

### 3. Frontend setup

```bash
cd Frontend
npm install
```

Create your `.env` file:
```dotenv
VITE_SERPAPI_KEY=your_serpapi_key_here
VITE_API_URL=http://localhost:5000
```

Run the dev server:
```bash
npm run dev
```

Frontend will be running at `http://localhost:5173`

---

## 🌐 Deploying to Production

### Backend → Render

1. Push your `Backend/` folder to a GitHub repository
2. Go to [render.com](https://render.com) → **New Web Service** → connect your repo
3. Set **Root Directory** to `Backend`
4. Set **Build Command** to:
   ```
   pip install -r requirements.txt
   ```
5. Set **Start Command** to:
   ```
   gunicorn app:app --bind 0.0.0.0:$PORT
   ```
6. Add these **Environment Variables** on Render:
   | Key | Value |
   |---|---|
   | `FRONTEND_URL` | `https://your-app.vercel.app` |
   | `SERPAPI_KEY` | your SerpAPI key |

7. Click **Deploy** — your API will be live at `https://your-service.onrender.com`

> ⚠️ Render free tier spins down after 15 minutes of inactivity. The first request after idle takes ~30 seconds to wake up.

---

### Frontend → Vercel

1. Push your `Frontend/` folder to GitHub
2. Go to [vercel.com](https://vercel.com) → **New Project** → import the repo
3. Set **Root Directory** to `Frontend` (if in a monorepo)
4. Add these **Environment Variables** on Vercel:
   | Key | Value |
   |---|---|
   | `VITE_API_URL` | `https://your-service.onrender.com` |
   | `VITE_SERPAPI_KEY` | your SerpAPI key |

5. Make sure `vercel.json` is in your frontend root with:
   ```json
   {
     "rewrites": [
       {
         "source": "/serpapi/:path*",
         "destination": "https://serpapi.com/:path*"
       }
     ]
   }
   ```

6. Click **Deploy**

---

## 🔑 Environment Variables Reference

### Frontend (`.env` for local / Vercel dashboard for production)

| Variable | Description |
|---|---|
| `VITE_API_URL` | URL of your Flask backend (`http://localhost:5000` locally, Render URL in production) |
| `VITE_SERPAPI_KEY` | Your SerpAPI key for Google Maps search |

### Backend (Render environment variables)

| Variable | Description |
|---|---|
| `FRONTEND_URL` | Your Vercel app URL — used by Flask-CORS to allow requests |
| `SERPAPI_KEY` | Your SerpAPI key (used server-side for place search and review fetching) |

---

## 📡 API Endpoints

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/health` | Health check |
| `POST` | `/predict` | Single review sentiment prediction |
| `POST` | `/analyze-reviews` | Bulk review analysis with summary |
| `GET` | `/search-places?q=` | Search restaurants via SerpAPI (server-side) |
| `GET` | `/get-reviews?data_id=` | Fetch Google Maps reviews via SerpAPI |

### Example — `/predict`

**Request:**
```json
POST /predict
{
  "review": "The food was absolutely amazing and the service was very friendly!"
}
```

**Response:**
```json
{
  "sentiment": "Positive",
  "label": 1,
  "highlights": {
    "positive": {
      "food": ["amazing"],
      "service": ["friendly"]
    },
    "negative": {}
  }
}
```

---

## 🧠 Model Training

To retrain the model on your own data:

```bash
cd Backend
python Training_Model.py
```

The script will:
1. Load `Restaurant_Reviews.tsv`
2. Preprocess all reviews
3. Train a Random Forest classifier
4. Print accuracy on the test set
5. Save `model.pkl` and `vectorizer.pkl`

Make sure to commit the updated `.pkl` files and redeploy on Render.

---

## 🐛 Common Issues

| Issue | Fix |
|---|---|
| CORS error on frontend | Set `FRONTEND_URL` on Render to your exact Vercel URL (no trailing slash), then redeploy Render |
| `model.pkl` not found on Render | Make sure `model.pkl` and `vectorizer.pkl` are committed to your repo — they are not generated at build time |
| SerpAPI returning HTML instead of JSON | SerpAPI calls must go through your Flask backend, not directly from the browser |
| Render cold start (~30s delay) | Expected on free tier — upgrade to paid or add a cron health-ping |
| Env vars not picked up on Vercel | Vercel bakes env vars at build time — always redeploy after changing them |
| `gunicorn: can't chdir to Backend` | Set Root Directory to `Backend` in Render settings, then use `gunicorn app:app` with no `--chdir` |

---

## 📄 License

MIT License — free to use, modify, and distribute.

---

## 🙌 Acknowledgements

- [SerpAPI](https://serpapi.com/) for Google Maps data
- [scikit-learn](https://scikit-learn.org/) for the ML pipeline
- [Recharts](https://recharts.org/) for the rating chart
- [Lucide](https://lucide.dev/) for icons
- Dataset sourced from public restaurant review corpora