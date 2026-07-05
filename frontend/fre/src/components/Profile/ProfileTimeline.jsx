import React from "react";
import { Clock, ArrowRight, Video } from "lucide-react";
import { useNavigate } from "react-router-dom";

const ProfileTimeline = ({ meetings }) => {
  const navigate = useNavigate();
  const list = meetings.slice(0, 3); // Take last 3 meetings

  return (
    <div className="p-6 border-t border-gray-100">
      
      <div className="border-b pb-4 mb-5">
        <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider">Recent Activity Timeline</h3>
        <p className="text-xs text-slate-400 font-semibold mt-0.5">Logs of previous and upcoming call sessions</p>
      </div>

      {list.length === 0 ? (
        <p className="text-xs text-slate-400 font-semibold">No recent activity logs available.</p>
      ) : (
        <div className="space-y-4">
          {list.map((m) => (
            <div
              key={m._id}
              className="bg-slate-50/50 border rounded-xl p-3.5 flex items-center justify-between hover:bg-slate-50 transition border-slate-150/60"
            >
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-lg bg-violet-50 text-violet-650 flex items-center justify-center flex-shrink-0">
                  <Video size={16} />
                </div>
                <div>
                  <h4 className="font-bold text-slate-800 text-xs truncate max-w-[200px]" title={m.title}>
                    {m.title}
                  </h4>
                  <p className="text-[10px] text-slate-400 font-semibold mt-0.5 flex items-center gap-1">
                    <Clock size={10} />
                    <span>{new Date(m.meetingDate).toLocaleString()}</span>
                  </p>
                </div>
              </div>

              <button
                onClick={() => navigate(`/meeting/${m.meetingLink}`)}
                className="text-violet-650 hover:text-violet-750 text-xs font-bold flex items-center gap-1"
              >
                <span>Join Room</span>
                <ArrowRight size={12} />
              </button>
            </div>
          ))}
        </div>
      )}

    </div>
  );
};

export default ProfileTimeline;
