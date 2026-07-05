import React from "react";
import { MessageSquareCode } from "lucide-react";
import HighlightCard from "../../components/AI/HighlightCard";

const Highlights = ({ highlights, onJump }) => {
  if (!highlights || highlights.length === 0) {
    return (
      <div className="py-12 text-center text-slate-400">
        <MessageSquareCode className="mx-auto text-slate-350 mb-2" size={32} />
        <p className="text-xs">No highlighted clips detected.</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2 mb-2">
        <MessageSquareCode size={18} className="text-violet-600" />
        <span className="text-sm font-bold text-slate-800">Important Moments Highlighted</span>
      </div>

      <div className="space-y-2">
        {highlights.map((hl, idx) => (
          <HighlightCard key={idx} highlight={hl} onJump={onJump} />
        ))}
      </div>
    </div>
  );
};

export default Highlights;
