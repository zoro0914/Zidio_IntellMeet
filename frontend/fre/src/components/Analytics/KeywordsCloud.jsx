import React from "react";
import { Tag } from "lucide-react";

const KeywordsCloud = ({ keywords }) => {
  // Take top 15 keywords
  const displayKeywords = keywords.slice(0, 15);

  const getWeightClass = (count) => {
    if (count > 4) return "text-sm bg-violet-100 text-violet-750 font-bold border-violet-200 px-3.5 py-1.5";
    if (count > 2) return "text-xs bg-slate-100 text-slate-700 font-bold border-slate-200 px-3 py-1";
    return "text-[10px] bg-slate-50 text-slate-450 font-semibold border-slate-150 px-2 py-0.5";
  };

  return (
    <div className="bg-white border rounded-2xl p-6 shadow-sm space-y-5 h-full flex flex-col">
      
      <div>
        <h3 className="font-bold text-slate-800 text-lg flex items-center gap-1.5">
          <Tag className="text-violet-600" size={18} />
          Keywords Cloud
        </h3>
        <p className="text-xs text-slate-450 mt-0.5 font-medium">Aggregated key topics discussed across call sessions</p>
      </div>

      <div className="flex-1 flex flex-wrap gap-2.5 items-center justify-center p-4 border border-dashed rounded-xl bg-slate-50/20">
        {displayKeywords.length === 0 ? (
          <p className="text-xs text-slate-400 font-semibold">No keyword tags recorded yet.</p>
        ) : (
          displayKeywords.map((item, index) => (
            <span
              key={index}
              className={`rounded-xl border transition hover:scale-105 duration-200 ${getWeightClass(item.count)}`}
              title={`Discovered in ${item.count} sessions`}
            >
              {item.text}
            </span>
          ))
        )}
      </div>

      <div className="text-[10px] text-slate-400 font-medium text-center">
        💡 Larger violet tags indicate higher occurrence of keywords in transcript segments.
      </div>

    </div>
  );
};

export default KeywordsCloud;
