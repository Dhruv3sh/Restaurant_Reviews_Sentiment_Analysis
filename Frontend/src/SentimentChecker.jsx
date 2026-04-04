// SentimentChecker.jsx
import { useState } from "react";

export default function SentimentChecker() {
  const [review, setReview] = useState("");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const analyze = async () => {
    setLoading(true);
    const res = await fetch("http://localhost:5000/predict", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ review }),
    });
    const data = await res.json();
    setResult(data.sentiment);
    setLoading(false);
  };

  return (
    <div>
      <textarea
        value={review}
        onChange={(e) => setReview(e.target.value)}
        placeholder="Paste a restaurant review..."
        rows={4}
      />
      <button onClick={analyze} disabled={loading || !review.trim()}>
        {loading ? "Analyzing..." : "Analyze sentiment"}
      </button>

      {result && (
        <p>
          Sentiment:{" "}
          <strong style={{ color: result === "positive" ? "green" : "red" }}>
            {result}
          </strong>
        </p>
      )}
    </div>
  );
}