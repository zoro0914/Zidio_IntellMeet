import React, { useState } from "react";
import { Search, FileText } from "lucide-react";
import TranscriptCard from "../../components/AI/TranscriptCard";

const Transcript = ({ transcript, onJump }) => {
  const [query, setQuery] = useState("");

  const filteredLines = transcript.filter(
    (line) =>
      line.text.toLowerCase().includes(query.toLowerCase()) ||
      line.speaker.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div className="h-full flex flex-col overflow-hidden space-y-4">
      
      {/* Transcript Inner Filter */}
      <div className="relative flex-shrink-0">
        <Search size={14} className="absolute left-3 top-3 text-slate-400" />
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Filter dialogues in transcript..."
          className="w-full pl-9 pr-4 py-2 text-xs border rounded-xl outline-none focus:ring-2 focus:ring-violet-500 transition shadow-sm bg-slate-50"
        />
      </div>

      {/* dialogue bubble lists */}
      <div className="flex-1 overflow-y-auto space-y-3 pr-1">
        {filteredLines.length > 0 ? (
          filteredLines.map((line, idx) => (
            <TranscriptCard
              key={idx}
              line={line}
              onJump={onJump}
              highlightText={query}
            />
          ))
        ) : (
          <div className="py-12 text-center">
            <FileText className="mx-auto text-slate-350 mb-2" size={32} />
            <p className="text-xs text-slate-400">No dialogue rows match your search.</p>
          </div>
        )}
      </div>

    </div>
  );
};

export default Transcript;
