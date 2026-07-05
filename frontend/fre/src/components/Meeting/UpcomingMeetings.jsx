import { CalendarDays, Clock, User, Video } from "lucide-react";
import { useNavigate } from "react-router-dom";

const UpcomingMeetings = ({ meetings = [], onCancel, onJoinTrigger }) => {
  const navigate = useNavigate();

  return (
    <section className="mt-10">
      
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-slate-800">
          Upcoming Meetings
        </h2>
      </div>

      {meetings.length === 0 ? (
        <div className="bg-white rounded-2xl border border-slate-205 p-8 text-center text-slate-500 shadow-sm font-semibold">
          No upcoming meetings scheduled.
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
          {meetings.map((meeting) => {
            const dateObj = new Date(meeting.meetingDate);
            const formattedDate = dateObj.toLocaleDateString("en-US", {
              day: "numeric",
              month: "short",
              year: "numeric",
            });
            const formattedTime = dateObj.toLocaleTimeString("en-US", {
              hour: "2-digit",
              minute: "2-digit",
            });

            return (
              <div
                key={meeting._id}
                className="bg-white rounded-2xl shadow-sm hover:shadow-lg transition p-6 border border-slate-200 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-5">
                    <span className="px-3 py-1 rounded-full bg-violet-100 text-violet-750 text-xs font-semibold">
                      {meeting.status === "live" ? "Live Now" : "Upcoming"}
                    </span>
                    <Video size={20} className="text-violet-650 animate-pulse" />
                  </div>

                  <h3 className="text-xl font-bold text-slate-805 mb-5 truncate" title={meeting.title}>
                    {meeting.title}
                  </h3>

                  <div className="space-y-3 text-slate-600 text-sm font-semibold mb-6">
                    <div className="flex items-center gap-2">
                      <CalendarDays size={18} className="text-violet-500" />
                      {formattedDate}
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock size={18} className="text-violet-500" />
                      {formattedTime}
                    </div>
                    <div className="flex items-center gap-2">
                      <User size={18} className="text-violet-500" />
                      Host: {meeting.createdBy?.name || "User"}
                    </div>
                  </div>
                </div>

                <div className="flex gap-3 mt-4">
                  <button
                    onClick={() => {
                      if (onJoinTrigger) {
                        onJoinTrigger(meeting.meetingLink);
                      } else {
                        navigate(`/meeting/${meeting.meetingLink}`);
                      }
                    }}
                    className="flex-1 bg-violet-600 hover:bg-violet-750 text-white rounded-xl py-2.5 font-semibold text-sm transition shadow-sm"
                  >
                    Join
                  </button>
                  {onCancel && (
                    <button
                      onClick={() => onCancel(meeting._id)}
                      className="px-3 py-2.5 border border-red-200 text-red-650 hover:bg-red-50 rounded-xl font-semibold text-xs transition"
                    >
                      Cancel
                    </button>
                  )}
                </div>

              </div>
            );
          })}
        </div>
      )}

    </section>
  );
};

export default UpcomingMeetings;