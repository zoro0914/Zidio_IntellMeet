import React from "react";
import { MicOff, VideoOff, UserMinus } from "lucide-react";
import socket from "../../Utils/socket";

const ParticipantPanel = ({ open, participants, hostId, localUserId, roomId }) => {
  if (!open) return null;

  const isCurrentUserHost = localUserId === hostId;

  const handleMute = (targetPeerId, type) => {
    socket.emit("mute-participant", { roomId, targetPeerId, type });
  };

  const handleKick = (targetPeerId) => {
    if (window.confirm("Are you sure you want to kick this participant?")) {
      socket.emit("kick-participant", { roomId, targetPeerId });
    }
  };

  return (
    <div className="w-80 bg-slate-900 text-white p-5 border-l border-slate-700 flex flex-col h-full">
      <h2 className="text-xl font-semibold mb-5 flex-shrink-0">
        Participants ({participants.length})
      </h2>

      <div className="space-y-3 overflow-y-auto flex-1 pr-1 custom-scrollbar">
        {participants.map((user) => {
          const isHost = user.userId === hostId;

          return (
            <div
              key={user.peerId}
              className={`flex flex-col gap-2 p-3 rounded-lg bg-slate-800 border ${
                isHost ? "border-violet-500/50" : "border-transparent"
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-violet-600 flex items-center justify-center font-bold flex-shrink-0">
                    {user.name?.charAt(0)?.toUpperCase() || "U"}
                  </div>

                  <div>
                    <div className="flex items-center gap-1.5">
                      <p className="font-medium text-sm truncate max-w-[120px]">{user.name}</p>
                      {isHost && (
                        <span className="px-1.5 py-0.5 text-[9px] font-bold bg-violet-600 text-white rounded uppercase tracking-wider">
                          Host
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-gray-400">
                      {user.peerId.slice(0, 8)}...
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  {user.raisedHand && (
                    <span className="text-lg animate-bounce" title="Hand Raised">
                      ✋
                    </span>
                  )}
                </div>
              </div>

              {/* Host actions section */}
              {isCurrentUserHost && !isHost && (
                <div className="flex items-center gap-2 pt-2 border-t border-slate-700/60 mt-1 justify-end">
                  <button
                    onClick={() => handleMute(user.peerId, "audio")}
                    title="Mute audio (Host action)"
                    className="p-1 bg-slate-700 hover:bg-slate-600 rounded text-slate-300 hover:text-white transition"
                  >
                    <MicOff size={12} />
                  </button>
                  <button
                    onClick={() => handleMute(user.peerId, "video")}
                    title="Mute video (Host action)"
                    className="p-1 bg-slate-700 hover:bg-slate-600 rounded text-slate-300 hover:text-white transition"
                  >
                    <VideoOff size={12} />
                  </button>
                  <button
                    onClick={() => handleKick(user.peerId)}
                    title="Kick participant (Host action)"
                    className="p-1 bg-red-950/40 hover:bg-red-650 rounded text-red-400 hover:text-white transition"
                  >
                    <UserMinus size={12} />
                  </button>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ParticipantPanel;