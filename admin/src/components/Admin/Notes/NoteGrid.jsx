import React from 'react';
import { FileText, Eye, Trash2, Calendar, Link } from 'lucide-react';

const NoteGrid = ({ notes, onViewDetails, onDelete }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {notes.length > 0 ? (
        notes.map((note) => {
          const meetingTitle = note.meetingId?.title || 'General Meeting';
          const createdDate = new Date(note.createdAt).toLocaleDateString(undefined, {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
          });

          return (
            <div 
              key={note._id} 
              className="bg-slate-950/60 border border-slate-800/60 hover:border-violet-500/40 rounded-2xl p-5 shadow-xl transition-all duration-300 flex flex-col justify-between space-y-4 group relative overflow-hidden"
            >
              {/* Decorative top indicator glow */}
              <div className="absolute top-0 inset-x-0 h-[2px] bg-gradient-to-r from-violet-600 to-indigo-650 opacity-50 group-hover:opacity-100 transition-opacity" />

              <div className="space-y-3">
                <div className="flex items-start justify-between gap-3">
                  <div className="p-2 rounded-xl bg-violet-600/10 text-violet-400">
                    <FileText size={18} />
                  </div>
                  
                  {/* Status tag or badge */}
                  <span className="text-[9px] font-bold px-2 py-0.5 rounded-full bg-slate-900 border border-slate-800 text-slate-400 flex items-center gap-1">
                    <Link size={8} />
                    Linked Note
                  </span>
                </div>

                <div className="space-y-1">
                  <h4 className="font-bold text-white text-sm group-hover:text-violet-400 transition truncate">
                    {note.title}
                  </h4>
                  <p className="text-[10px] text-slate-500 font-semibold truncate uppercase tracking-wider">
                    Meeting: {meetingTitle}
                  </p>
                </div>

                <p className="text-slate-400 text-xs line-clamp-3 leading-relaxed">
                  {note.body}
                </p>
              </div>

              <div className="pt-3 border-t border-slate-900 flex items-center justify-between text-[10px] text-slate-500 font-bold">
                <span className="flex items-center gap-1.5">
                  <Calendar size={12} />
                  {createdDate}
                </span>

                <div className="flex items-center gap-1">
                  <button 
                    onClick={() => onViewDetails(note)}
                    className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-900 transition"
                    title="View details"
                  >
                    <Eye size={12} />
                  </button>
                  <button 
                    onClick={() => onDelete(note)}
                    className="p-1.5 rounded-lg text-slate-400 hover:text-red-400 hover:bg-red-500/10 transition"
                    title="Delete Note"
                  >
                    <Trash2 size={12} />
                  </button>
                </div>
              </div>
            </div>
          );
        })
      ) : (
        <div className="col-span-full py-16 text-center text-slate-500 text-xs font-bold bg-slate-950/20 border border-slate-850 rounded-2xl flex flex-col items-center justify-center gap-3">
          <FileText size={32} className="text-slate-700 animate-bounce" />
          <span>No notes registry available. Select "Create Note" to add one.</span>
        </div>
      )}
    </div>
  );
};

export default NoteGrid;
