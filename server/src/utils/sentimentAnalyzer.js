import vader from "vader-sentiment";

export const analyzeSentiment = (text) => {
  const result = vader.SentimentIntensityAnalyzer.polarity_scores(text);
  return result.compound;
};

export const getSentimentLabel = (score) => {
  if (score >= 0.05) {
    return "Positive";
  } else if (score <= -0.05) {
    return "Negative";
  } else {
    return "Neutral";
  }
};
