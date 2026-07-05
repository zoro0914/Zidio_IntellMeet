import React from "react";
import { PlayCircle, MessageSquare } from "lucide-react";

const HighlightCard = ({ highlight, onJump }) => {
  const { time, text } = highlight;
  return (
    <div
      onClick={() => onJump(time)}
      className="flex items-center justify-between bg-white border border-gray-150 rounded-xl p-3.5 hover:bg-slate-50 cursor-pointer shadow-sm hover:shadow-md transition-all"
    >
      <div className="flex items-center gap-3 min-w-0">
        <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center flex-shrink-0">
          <MessageSquare size={16} />
        </div>
        <div className="min-w-0">
          <p className="text-sm font-semibold text-slate-800 truncate">{text}</p>
          <span className="text-xs text-slate-400">Timestamp: {time}</span>
        </div>
      </div>
      <PlayCircle size={18} className="text-slate-400 group-hover:text-violet-600 ml-2" />
    </div>
  );
};

export default HighlightCard;
