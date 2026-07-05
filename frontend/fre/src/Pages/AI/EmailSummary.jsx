import React from "react";
import { X, Mail } from "lucide-react";

const EmailSummary = ({ recording, onClose, onCopy }) => {
  return (
    <div className="fixed inset-0 bg-slate-900/60 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
      <div className="bg-white border rounded-2xl max-w-lg w-full p-6 shadow-2xl flex flex-col max-h-[80vh] overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b mb-4 flex-shrink-0">
          <div className="flex items-center gap-2 text-violet-600 font-bold">
            <Mail size={20} />
            <span>Email Summary Draft</span>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600">
            <X size={18} />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto bg-slate-50 border rounded-xl p-4 text-xs font-mono text-slate-700 leading-relaxed whitespace-pre-line">
          {recording.emailSummary || "AI email summary text draft is preparing..."}
        </div>

        {/* Footer controls */}
        <div className="flex gap-3 mt-6 flex-shrink-0">
          <button
            onClick={onClose}
            className="flex-1 border rounded-xl py-2.5 font-semibold text-slate-600 hover:bg-slate-50 transition"
          >
            Close
          </button>
          <button
            onClick={() => onCopy(recording)}
            className="flex-1 bg-violet-600 hover:bg-violet-700 text-white rounded-xl py-2.5 font-semibold transition shadow-sm flex items-center justify-center gap-1.5"
          >
            <Mail size={16} />
            <span>Copy Draft</span>
          </button>
        </div>

      </div>
    </div>
  );
};

export default EmailSummary;
