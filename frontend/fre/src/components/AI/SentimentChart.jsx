import React from "react";
import { Smile, Frown, AlertCircle } from "lucide-react";

const SentimentChart = ({ sentiment }) => {
  const getToneDetails = () => {
    switch (sentiment) {
      case "Positive":
        return {
          icon: Smile,
          color: "text-green-600 bg-green-50 border-green-200",
          barColor: "bg-emerald-500",
          percentage: 85,
          desc: "Great collaboration and positive team feedback."
        };
      case "Neutral":
        return {
          icon: AlertCircle,
          color: "text-blue-600 bg-blue-50 border-blue-200",
          barColor: "bg-blue-500",
          percentage: 55,
          desc: "Constructive discussion with balanced points."
        };
      case "Negative":
        return {
          icon: Frown,
          color: "text-red-600 bg-red-50 border-red-200",
          barColor: "bg-red-500",
          percentage: 25,
          desc: "Critical roadblocks and concerns highlighted."
        };
      default:
        return {
          icon: Smile,
          color: "text-green-600 bg-green-50 border-green-200",
          barColor: "bg-emerald-500",
          percentage: 75,
          desc: "Sentiment metric normal."
        };
    }
  };

  const { icon: Icon, color, barColor, percentage, desc } = getToneDetails();

  return (
    <div className="bg-white border border-gray-150 rounded-2xl p-5 shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Tone & Sentiment Analysis</h4>
        <span className={`text-xs font-bold px-2.5 py-0.5 rounded-full flex items-center gap-1 border ${color}`}>
          <Icon size={12} />
          {sentiment || "Unknown"}
        </span>
      </div>

      <div className="space-y-2">
        <div className="flex justify-between text-xs font-bold text-slate-700">
          <span>Collaboration Index</span>
          <span>{percentage}%</span>
        </div>
        <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
          <div
            className={`h-full rounded-full transition-all duration-700 ${barColor}`}
            style={{ width: `${percentage}%` }}
          />
        </div>
      </div>
      <p className="text-xs text-slate-400 mt-3 font-medium">
        {desc}
      </p>
    </div>
  );
};

export default SentimentChart;
