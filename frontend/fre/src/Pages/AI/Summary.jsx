import React from "react";
import SummaryCard from "../../components/AI/SummaryCard";
import DecisionCard from "../../components/AI/DecisionCard";
import KeywordTags from "../../components/AI/KeywordTags";
import SentimentChart from "../../components/AI/SentimentChart";
import InsightCard from "../../components/AI/InsightCard";

const Summary = ({ recording }) => {
  return (
    <div className="space-y-6">
      
      {/* Dynamic Summary */}
      <SummaryCard summary={recording.summary} />

      {/* Grid: Sentiment and Keywords */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <SentimentChart sentiment={recording.sentiment} />
        <KeywordTags keywords={recording.keywords} />
      </div>

      {/* Decisions Section */}
      {recording.keyDecisions && recording.keyDecisions.length > 0 && (
        <div className="space-y-3">
          <h3 className="font-bold text-slate-800 text-sm">Key Decisions</h3>
          <div className="grid grid-cols-1 gap-3">
            {recording.keyDecisions.map((decision, index) => (
              <DecisionCard key={index} decision={decision} index={index + 1} />
            ))}
          </div>
        </div>
      )}

      {/* Quick Insights List */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <InsightCard title="Total Duration" value={recording.duration} type="duration" />
        <InsightCard title="Cloud Disk Size" value={`${recording.size} MB`} type="storage" />
      </div>

    </div>
  );
};

export default Summary;
