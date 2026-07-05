import React from "react";
import { FileText, Edit, Trash2, Brain, Download, Calendar, User } from "lucide-react";

const NoteCard = ({ note, onEdit, onDelete, onDownload }) => {
  const isAI = note.title.startsWith("[AI Note]");
  const createdDate = new Date(note.createdAt || note.updatedAt).toLocaleDateString(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric",
  });

  const authorName = note.createdBy?.name || "Member";
  const authorInitial = authorName.charAt(0).toUpperCase();

  // Pick gradient depending on note type
  const thumbnailGradient = isAI
    ? "from-violet-600 to-indigo-800"
    : "from-fuchsia-600 to-pink-850";

  return (
    <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden hover:shadow-md transition-all duration-300 group flex flex-col relative">

      {/* Thumbnail area */}
      <div className={`relative h-28 bg-gradient-to-tr ${thumbnailGradient} flex items-center justify-center text-white overflow-hidden flex-shrink-0`}>
        <div className="absolute inset-0 bg-black/20 group-hover:bg-black/35 transition-colors duration-300" />

        {/* Note Status tag */}
        {isAI ? (
          <span className="absolute top-3 left-3 bg-violet-650 text-white font-bold text-[9px] px-2 py-0.5 rounded shadow flex items-center gap-1 z-10 uppercase tracking-wider">
            <Brain size={10} className="text-amber-300" />
            AI Draft Note
          </span>
        ) : (
          <span className="absolute top-3 left-3 bg-slate-900 text-white font-bold text-[9px] px-2 py-0.5 rounded shadow flex items-center gap-1 z-10 uppercase tracking-wider">
            <FileText size={10} className="text-violet-400" />
            Manual Note
          </span>
        )}

        {/* Central Icon */}
        <div className="absolute z-10 w-10 h-10 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-md transition-all duration-300 scale-95 group-hover:scale-100">
          {isAI ? <Brain size={18} className="text-amber-200" /> : <FileText size={18} className="text-white" />}
        </div>
      </div>

      {/* Info card details */}
      <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
        <div className="space-y-3">
          <h3
            className="font-bold text-slate-800 text-base group-hover:text-violet-600 transition truncate"
            title={note.title}
          >
            {note.title}
          </h3>

          <p className="text-slate-500 text-xs leading-relaxed line-clamp-3 font-semibold">
            {note.body}
          </p>

          <div className="flex items-center gap-2.5 pt-2">
            <div className="w-8 h-8 rounded-full bg-violet-100 text-violet-600 font-bold flex items-center justify-center text-xs shadow-sm flex-shrink-0">
              {authorInitial}
            </div>
            <div className="min-w-0">
              <p className="text-xs font-bold text-slate-700 truncate">{authorName}</p>
              <p className="text-[10px] text-slate-400 font-semibold">{createdDate}</p>
            </div>
          </div>
        </div>

        {/* Card actions footer panel */}
        <div className="flex items-center justify-end border-t border-gray-150 border-gray-100 pt-4 flex-shrink-0 gap-1">
          <button
            onClick={() => onDownload(note)}
            title="Download note"
            className="p-2 text-slate-400 hover:text-violet-650 hover:bg-violet-50 rounded-xl transition"
          >
            <Download size={14} />
          </button>

          <button
            onClick={() => onEdit(note)}
            title="Edit note"
            className="p-2 text-slate-400 hover:text-violet-650 hover:bg-violet-50 rounded-xl transition"
          >
            <Edit size={14} />
          </button>

          <button
            onClick={() => onDelete(note._id)}
            title="Delete note"
            className="p-2 text-slate-400 hover:text-red-650 hover:bg-red-50 rounded-xl transition"
          >
            <Trash2 size={14} />
          </button>
        </div>

      </div>

    </div>
  );
};

export default NoteCard;
