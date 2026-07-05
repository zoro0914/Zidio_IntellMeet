import React from 'react';
import { X, Calendar, FileText, Link2 } from 'lucide-react';

const NoteDetailsModal = ({ isOpen, onClose, note }) => {
  if (!isOpen || !note) return null;

  const meetingTitle = note.meetingId?.title || 'General Meeting';
  const createdDate = new Date(note.createdAt).toLocaleString(undefined, {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 px-4 animate-in fade-in duration-200">
      <div className="bg-slate-950 border border-slate-800 rounded-2xl w-full max-w-lg shadow-2xl p-6 relative text-slate-100 animate-in zoom-in-95 duration-200 space-y-4">

        {/* Header */}
        <div className="flex justify-between items-center pb-2 border-b border-slate-800">
          <h3 className="text-sm font-bold text-white flex items-center gap-2">
            <FileText size={16} className="text-violet-500" />
            Note specifications
          </h3>
          <button onClick={onClose} className="text-slate-400 hover:text-white">
            <X size={16} />
          </button>
        </div>

        {/* Content */}
        <div className="space-y-4 text-xs">
          <div>
            <h2 className="text-base font-black text-white">{note.title}</h2>
            <div className="flex flex-col gap-1 mt-2.5">
              <span className="text-[10px] text-slate-450 font-bold uppercase tracking-wider flex items-center gap-1.5 text-violet-400">
                <Link2 size={12} />
                Meeting: {meetingTitle}
              </span>
              <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider flex items-center gap-1.5">
                <Calendar size={12} />
                Created: {createdDate}
              </span>
            </div>
          </div>

          <div className="border border-slate-800/80 bg-slate-900/30 rounded-xl p-4.5 max-h-72 overflow-y-auto leading-relaxed text-slate-300 font-medium whitespace-pre-wrap">
            {note.body}
          </div>
        </div>

        {/* Action Button */}
        <div className="pt-2">
          <button
            onClick={onClose}
            className="w-full py-2.5 rounded-xl text-slate-200 bg-slate-900 border border-slate-800 hover:bg-slate-850 hover:text-white transition text-xs font-bold"
          >
            Close
          </button>
        </div>

      </div>
    </div>
  );
};

export default NoteDetailsModal;
