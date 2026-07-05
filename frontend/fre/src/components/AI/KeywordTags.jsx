import React from "react";
import { Tag } from "lucide-react";

const KeywordTags = ({ keywords }) => {
  if (!keywords || keywords.length === 0) return null;

  return (
    <div className="bg-white border border-gray-150 rounded-2xl p-5 shadow-sm">
      <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">AI Keywords & Topics</h4>
      <div className="flex flex-wrap gap-2">
        {keywords.map((word, index) => (
          <span
            key={index}
            className="flex items-center gap-1 text-xs font-semibold bg-slate-50 text-slate-600 border border-gray-100 rounded-xl px-3 py-1 hover:bg-slate-100 transition shadow-sm"
          >
            <Tag size={10} className="text-violet-500" />
            {word}
          </span>
        ))}
      </div>
    </div>
  );
};

export default KeywordTags;
