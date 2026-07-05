import React from "react";
import { X, Brain, FileText, CheckSquare, MessageSquareCode } from "lucide-react";
import Summary from "../../Pages/AI/Summary";
import ActionItems from "../../Pages/AI/ActionItems";
import Transcript from "../../Pages/AI/Transcript";
import Highlights from "../../Pages/AI/Highlights";

const PlaybackModal = ({
  activeVideo,
  onClose,
  videoPlayerRef,
  modalTab,
  setModalTab,
  onJumpToTime,
}) => {
  const hostName = activeVideo.host || activeVideo.createdBy?.name || "User";
  const formattedDate = activeVideo.meetingDate || activeVideo.date;

  return (
    <div className="fixed inset-0 bg-slate-950/80 z-50 flex items-center justify-center p-4 md:p-8 backdrop-blur-md animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl w-full max-w-6xl h-[85vh] flex flex-col overflow-hidden shadow-2xl animate-in zoom-in-95 duration-200">
        
        {/* Modal Header */}
        <div className="px-6 py-4 border-b border-gray-150 flex items-center justify-between bg-slate-50 flex-shrink-0">
          <div className="min-w-0">
            <h2 className="font-bold text-slate-900 text-lg md:text-xl truncate">{activeVideo.title}</h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Hosted by {hostName} on {formattedDate}
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-600 hover:bg-white rounded-xl border border-transparent hover:border-gray-200 transition shadow-sm"
          >
            <X size={20} />
          </button>
        </div>

        {/* Modal Body Container */}
        <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 overflow-hidden">
          
          {/* Left panel: Video Player */}
          <div className="lg:col-span-7 bg-slate-900 flex items-center justify-center relative p-2 lg:p-4">
            <video
              ref={videoPlayerRef}
              src={activeVideo.videoUrl}
              controls
              className="w-full h-full max-h-[55vh] lg:max-h-full object-contain rounded-xl shadow-lg border border-slate-800"
              poster=""
            />
          </div>

          {/* Right panel: AI Summaries, Transcripts, and Assistant Chat */}
          <div className="lg:col-span-5 flex flex-col h-full overflow-hidden border-l">
            
            {/* Tab Selector */}
            <div className="flex border-b flex-shrink-0 bg-slate-50/50">
              <button
                onClick={() => setModalTab("summary")}
                className={`flex-1 py-3.5 font-bold text-xs border-b-2 flex items-center justify-center gap-1 transition ${
                  modalTab === "summary"
                    ? "border-violet-600 text-violet-600 bg-violet-50/20"
                    : "border-transparent text-slate-500 hover:text-slate-800"
                }`}
              >
                <Brain size={14} />
                Summary
              </button>
              
              <button
                onClick={() => setModalTab("actions")}
                className={`flex-1 py-3.5 font-bold text-xs border-b-2 flex items-center justify-center gap-1 transition ${
                  modalTab === "actions"
                    ? "border-violet-600 text-violet-600 bg-violet-50/20"
                    : "border-transparent text-slate-500 hover:text-slate-800"
                }`}
              >
                <CheckSquare size={14} />
                Tasks
              </button>

              <button
                onClick={() => setModalTab("transcript")}
                className={`flex-1 py-3.5 font-bold text-xs border-b-2 flex items-center justify-center gap-1 transition ${
                  modalTab === "transcript"
                    ? "border-violet-600 text-violet-600 bg-violet-50/20"
                    : "border-transparent text-slate-500 hover:text-slate-800"
                }`}
              >
                <FileText size={14} />
                Transcript
              </button>

              <button
                onClick={() => setModalTab("highlights")}
                className={`flex-1 py-3.5 font-bold text-xs border-b-2 flex items-center justify-center gap-1 transition ${
                  modalTab === "highlights"
                    ? "border-violet-600 text-violet-600 bg-violet-50/20"
                    : "border-transparent text-slate-500 hover:text-slate-800"
                }`}
              >
                <MessageSquareCode size={14} />
                Highlights
              </button>
            </div>

            {/* Tab Content Panels */}
            <div className="flex-1 overflow-y-auto p-6 min-h-0 bg-white">
              {modalTab === "summary" && (
                <Summary recording={activeVideo} />
              )}

              {modalTab === "actions" && (
                <ActionItems actionItems={activeVideo.actionItems} recordingId={activeVideo.id} />
              )}

              {modalTab === "transcript" && (
                <Transcript transcript={activeVideo.transcript} onJump={onJumpToTime} />
              )}

              {modalTab === "highlights" && (
                <Highlights highlights={activeVideo.highlights} onJump={onJumpToTime} />
              )}
            </div>

            {/* Modal Footer helper */}
            <div className="p-4 bg-slate-50 border-t text-center text-xs text-slate-400 font-medium flex-shrink-0">
              💡 Click on any transcript time badge to jump the video directly to that specific conversation timestamp.
            </div>

          </div>

        </div>

      </div>
    </div>
  );
};

export default PlaybackModal;
