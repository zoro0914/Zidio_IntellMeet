import React from "react";
import { Award } from "lucide-react";

const DecisionCard = ({ decision, index }) => {
  return (
    <div className="flex gap-3 bg-white border border-gray-150 rounded-xl p-4 shadow-sm hover:shadow-md transition duration-200">
      <div className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center flex-shrink-0">
        <Award size={16} />
      </div>
      <div className="min-w-0">
        <span className="text-[10px] font-bold text-slate-400 uppercase">Decision #{index}</span>
        <p className="text-sm text-slate-700 font-medium leading-relaxed mt-0.5">{decision}</p>
      </div>
    </div>
  );
};

export default DecisionCard;
