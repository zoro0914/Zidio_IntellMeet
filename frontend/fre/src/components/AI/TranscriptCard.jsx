import React from "react";

const TranscriptCard = ({ line, onJump, highlightText = "" }) => {
  const { time, speaker, text } = line;

  const highlightMatches = (content, match) => {
    if (!match.trim()) return content;
    const parts = content.split(new RegExp(`(${match})`, "gi"));
    return (
      <span>
        {parts.map((part, i) =>
          part.toLowerCase() === match.toLowerCase() ? (
            <mark key={i} className="bg-yellow-100 text-slate-900 rounded px-0.5">{part}</mark>
          ) : (
            part
          )
        )}
      </span>
    );
  };

  return (
    <div
      onClick={() => onJump(time)}
      className="group cursor-pointer hover:bg-slate-50 border border-transparent hover:border-slate-100 rounded-xl p-3.5 transition-all flex gap-3.5"
    >
      <span className="text-xs font-bold text-violet-600 bg-violet-50 group-hover:bg-violet-600 group-hover:text-white px-2.5 py-1 rounded-md h-fit transition-colors shadow-sm">
        {time}
      </span>
      <div className="min-w-0 flex-1">
        <span className="font-bold text-sm text-slate-800 block mb-0.5">
          {highlightMatches(speaker, highlightText)}
        </span>
        <p className="text-sm text-slate-500 leading-relaxed">
          {highlightMatches(text, highlightText)}
        </p>
      </div>
    </div>
  );
};

export default TranscriptCard;
