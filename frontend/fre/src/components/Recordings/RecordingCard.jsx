import React from "react";
import {
  Play,
  PlayCircle,
  Download,
  Trash2,
  Share2,
  Clock,
  Star,
  Brain,
  Sparkles,
  Mail,
  Loader,
} from "lucide-react";

const RecordingCard = ({
  rec,
  onPlay,
  onProcessAI,
  onToggleFavorite,
  onShare,
  onDownload,
  onDelete,
  onEmailShare,
  processingId,
}) => {
  const hostInitial = (rec.host || (rec.createdBy?.name || "User")).charAt(0).toUpperCase();
  const hostName = rec.host || rec.createdBy?.name || "User";
  const formattedDate = rec.meetingDate || rec.date;

  return (
    <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden hover:shadow-md transition-all duration-300 group flex flex-col relative">
      
      {/* Thumbnail area */}
      <div className={`relative aspect-video bg-gradient-to-tr ${rec.thumbnailGradient || "from-slate-650 to-slate-800"} flex items-center justify-center text-white overflow-hidden flex-shrink-0`}>
        <div className="absolute inset-0 bg-black/25 group-hover:bg-black/40 transition-colors duration-300" />

        {/* AI Status tag */}
        {!rec.summary ? (
          <span className="absolute top-3 left-3 bg-rose-600 text-white font-bold text-[10px] px-2 py-0.5 rounded shadow flex items-center gap-1 z-10">
            <Brain size={12} />
            AI Pending
          </span>
        ) : (
          <span className="absolute top-3 left-3 bg-violet-600 text-white font-bold text-[10px] px-2 py-0.5 rounded shadow flex items-center gap-1 z-10">
            <Sparkles size={12} />
            AI Active
          </span>
        )}

        {/* Play Action overlays */}
        {rec.summary ? (
          <button
            onClick={() => onPlay(rec)}
            className="absolute z-10 w-14 h-14 bg-white/20 hover:bg-white text-white hover:text-slate-900 rounded-full flex items-center justify-center backdrop-blur-md transition-all duration-300 scale-95 group-hover:scale-100 hover:shadow-lg"
          >
            <Play size={24} fill="currentColor" className="ml-1" />
          </button>
        ) : (
          <button
            onClick={() => onProcessAI(rec.id)}
            disabled={processingId === rec.id}
            className="absolute z-10 px-4 py-2.5 bg-white/95 hover:bg-white text-slate-900 font-bold rounded-xl flex items-center gap-2 hover:scale-105 shadow-xl transition-all duration-300 disabled:opacity-50"
          >
            {processingId === rec.id ? (
              <>
                <Loader className="animate-spin text-violet-600" size={16} />
                <span>Processing...</span>
              </>
            ) : (
              <>
                <Brain className="text-violet-600" size={16} />
                <span>Process AI</span>
              </>
            )}
          </button>
        )}

        {/* Bookmark toggler */}
        <button
          onClick={() => onToggleFavorite(rec.id)}
          className="absolute top-3 right-3 z-10 p-2 rounded-xl bg-black/40 hover:bg-black/60 text-white backdrop-blur-sm transition-all"
        >
          <Star
            size={18}
            className={rec.isFavorite ? "text-amber-400 fill-amber-400" : "text-white"}
          />
        </button>

        <span className="absolute bottom-3 right-3 z-10 bg-black/70 text-xs px-2.5 py-1 rounded-lg font-semibold flex items-center gap-1.5 backdrop-blur-sm">
          <Clock size={12} />
          {rec.duration}
        </span>
      </div>

      {/* Info card details */}
      <div className="p-5 flex-1 flex flex-col justify-between">
        <div>
          <h3 className="font-bold text-slate-800 text-lg group-hover:text-violet-600 transition truncate">
            {rec.title}
          </h3>

          <div className="flex items-center gap-2.5 mt-3">
            <div className="w-8 h-8 rounded-full bg-violet-100 text-violet-600 font-bold flex items-center justify-center text-xs shadow-sm flex-shrink-0">
              {hostInitial}
            </div>
            <div className="min-w-0">
              <p className="text-sm font-semibold text-slate-700 truncate">{hostName}</p>
              <p className="text-xs text-slate-400">{formattedDate} • {rec.size} MB</p>
            </div>
          </div>
        </div>

        {/* Card actions footer panel */}
        <div className="flex items-center justify-between border-t border-gray-100 pt-4 mt-5 flex-shrink-0">
          {rec.summary ? (
            <button
              onClick={() => onPlay(rec)}
              className="flex items-center gap-1.5 text-sm text-violet-600 hover:text-violet-700 font-semibold"
            >
              <Play size={14} fill="currentColor" />
              <span>AI Analytics</span>
            </button>
          ) : (
            <button
              onClick={() => onProcessAI(rec.id)}
              disabled={processingId === rec.id}
              className="flex items-center gap-1.5 text-sm text-slate-400 hover:text-violet-600 font-semibold disabled:opacity-50"
            >
              <Brain size={14} />
              <span>Run Analyzer</span>
            </button>
          )}

          <div className="flex items-center gap-1.5">
            {rec.summary && (
              <button
                onClick={() => onEmailShare(rec)}
                title="Generate Summary Email"
                className="p-2 text-slate-400 hover:text-violet-600 hover:bg-violet-50 rounded-xl transition"
              >
                <Mail size={16} />
              </button>
            )}
            <button
              onClick={() => onShare(rec)}
              title="Share link"
              className="p-2 text-slate-400 hover:text-violet-600 hover:bg-violet-50 rounded-xl transition"
            >
              <Share2 size={16} />
            </button>
            <button
              onClick={() => onDownload(rec)}
              title="Download MP4"
              className="p-2 text-slate-400 hover:text-violet-600 hover:bg-violet-50 rounded-xl transition"
            >
              <Download size={16} />
            </button>
            <button
              onClick={() => onDelete(rec.id)}
              title="Delete recording"
              className="p-2 text-slate-400 hover:text-red-650 hover:bg-red-50 rounded-xl transition"
            >
              <Trash2 size={16} />
            </button>
          </div>
        </div>

      </div>

    </div>
  );
};

export default RecordingCard;
