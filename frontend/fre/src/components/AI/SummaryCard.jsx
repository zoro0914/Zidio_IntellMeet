import React from "react";
import { Sparkles } from "lucide-react";

const SummaryCard = ({ summary }) => {
  return (
    <div className="bg-violet-50/20 border border-violet-100 rounded-2xl p-5 shadow-sm">
      <div className="flex items-center gap-2 mb-3">
        <Sparkles size={16} className="text-violet-600 animate-pulse" />
        <span className="text-xs font-bold text-violet-600 tracking-wider uppercase">AI Generated Summary</span>
      </div>
      <p className="text-sm text-slate-600 leading-relaxed italic">
        "{summary || "No summary text generated yet for this recording."}"
      </p>
    </div>
  );
};

export default SummaryCard;
