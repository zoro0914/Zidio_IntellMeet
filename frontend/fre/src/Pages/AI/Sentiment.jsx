import React from "react";
import SentimentChart from "../../components/AI/SentimentChart";

const Sentiment = ({ recording }) => {
  return (
    <div className="space-y-4">
      <SentimentChart sentiment={recording.sentiment} />
    </div>
  );
};

export default Sentiment;
