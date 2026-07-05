import React from "react";
import { Brain, Calendar, FileText, ClipboardList, ChevronRight, Loader } from "lucide-react";

const SummaryDetailsCard = ({ meeting, onDownload, onReadTranscript, onRegenerate, aiGenerating }) => {
  const summaryDate = new Date(meeting.meetingDate).toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
  });

  const actionItems = meeting.actionItems && meeting.actionItems.length > 0
    ? meeting.actionItems
    : ["No formal action items assigned during this session."];

  const keyDecisions = meeting.keyDecisions && meeting.keyDecisions.length > 0
    ? meeting.keyDecisions
    : ["No critical decisions explicitly recorded."];

  return (
    <div className="border border-gray-150 rounded-2xl p-6 bg-white shadow-sm space-y-6">
      
      {/* AI banner */}
      <div className="flex items-center gap-2 text-violet-605 font-bold text-sm">
        <Brain size={18} className="animate-pulse" />
        <span>AI Generated Meeting Diagnostics</span>
      </div>

      <div>
        <h2 className="text-xl font-bold text-slate-800 mb-1">{meeting.title}</h2>
        <div className="flex items-center gap-1.5 text-xs text-slate-400 font-semibold">
          <Calendar size={12} />
          <span>{summaryDate}</span>
        </div>
      </div>

      {/* Summary Text block */}
      <div className="space-y-2">
        <h3 className="font-bold text-slate-700 text-sm">Overview Summary:</h3>
        <p className="text-sm text-slate-550 leading-relaxed bg-slate-50 p-4 rounded-xl border border-slate-100 font-medium">
          {meeting.summary || "No automated summary has been generated for this session yet."}
        </p>
      </div>

      {/* Grid columns for Action items & Key Decisions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
        
        {/* Action Items */}
        <div className="space-y-3">
          <h3 className="font-bold text-slate-700 text-sm flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-violet-600" />
            Key Action Items:
          </h3>
          <ul className="space-y-2">
            {actionItems.map((point, index) => (
              <li key={index} className="flex gap-2 text-xs text-slate-500 leading-normal font-medium">
                <ChevronRight size={14} className="text-violet-500 flex-shrink-0 mt-0.5" />
                <span>{point}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Key Decisions */}
        <div className="space-y-3">
          <h3 className="font-bold text-slate-700 text-sm flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
            Key Decisions:
          </h3>
          <ul className="space-y-2">
            {keyDecisions.map((decision, index) => (
              <li key={index} className="flex gap-2 text-xs text-slate-500 leading-normal font-medium">
                <ChevronRight size={14} className="text-emerald-500 flex-shrink-0 mt-0.5" />
                <span>{decision}</span>
              </li>
            ))}
          </ul>
        </div>

      </div>

      {/* Action buttons */}
      <div className="border-t pt-5 flex flex-wrap gap-3">
        <button
          onClick={() => onDownload(meeting)}
          className="flex items-center gap-1.5 text-xs bg-white hover:bg-slate-50 border rounded-lg px-4 py-2.5 font-bold shadow-sm transition text-slate-700 cursor-pointer"
        >
          <FileText size={14} />
          <span>Download Summary Log (.md)</span>
        </button>
        <button
          onClick={() => onReadTranscript(meeting)}
          className="flex items-center gap-1.5 text-xs bg-violet-600 hover:bg-violet-750 text-white rounded-lg px-4 py-2.5 font-bold shadow-sm transition cursor-pointer"
        >
          <ClipboardList size={14} />
          <span>Read Full Transcript</span>
        </button>
        {onRegenerate && (
          <button
            onClick={() => onRegenerate(meeting._id)}
            disabled={aiGenerating}
            className="flex items-center gap-1.5 text-xs bg-slate-900 hover:bg-slate-800 text-white rounded-lg px-4 py-2.5 font-bold shadow-sm transition cursor-pointer disabled:opacity-50"
          >
            {aiGenerating ? (
              <Loader size={14} className="animate-spin text-white" />
            ) : (
              <Brain size={14} />
            )}
            <span>Regenerate AI Summary</span>
          </button>
        )}
      </div>

    </div>
  );
};

export default SummaryDetailsCard;
