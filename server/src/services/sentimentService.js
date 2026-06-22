export function getHeuristicSentiment(text = "") {
  const lower = text.toLowerCase();

  if (/angry|frustrated|terrible|broken|failed|cannot|charged twice|not working/.test(lower)) {
    return { label: "negative", score: -0.68 };
  }

  if (/thanks|great|helpful|resolved|appreciate/.test(lower)) {
    return { label: "positive", score: 0.56 };
  }

  return { label: "neutral", score: 0 };
}

export function normalizeSentiment(sentiment = {}) {
  const label = ["negative", "neutral", "positive"].includes(sentiment.label) ? sentiment.label : "neutral";
  const score = Number(sentiment.score);

  return {
    label,
    score: Number.isFinite(score) ? Math.max(-1, Math.min(1, score)) : 0
  };
}
