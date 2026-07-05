import React from "react";
import { CheckCircle, Square } from "lucide-react";

const ActionCard = ({ action, isChecked, onToggle }) => {
  return (
    <div
      onClick={onToggle}
      className={`flex items-start gap-3 p-3.5 rounded-xl border cursor-pointer transition select-none ${
        isChecked
          ? "bg-slate-50/80 border-slate-200 text-slate-400"
          : "bg-white border-gray-150 text-slate-700 hover:bg-slate-50/50"
      }`}
    >
      {isChecked ? (
        <CheckCircle size={18} className="text-emerald-500 mt-0.5 flex-shrink-0" />
      ) : (
        <Square size={18} className="text-slate-400 mt-0.5 flex-shrink-0" />
      )}
      <span className={`text-sm leading-relaxed ${isChecked ? "line-through" : ""}`}>
        {action}
      </span>
    </div>
  );
};

export default ActionCard;
