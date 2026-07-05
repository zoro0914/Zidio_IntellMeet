import React from "react";
import { useNavigate } from "react-router-dom";
import {
  CalendarDays,
  Clock3,
  CheckCircle2,
  PlayCircle,
  FileText,
  Trash2,
} from "lucide-react";

const Completed = ({ meetings = [], onDelete }) => {
  const navigate = useNavigate();

  return (
    <section className="mt-10">
      
      {/* Heading */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-slate-800">
          Completed Meetings
        </h2>
      </div>

      {/* Cards */}
      {meetings.length === 0 ? (
        <div className="bg-white rounded-2xl border border-slate-200 p-8 text-center text-slate-505 shadow-sm font-semibold">
          No completed meetings.
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {meetings.map((meeting) => {
            const dateObj = new Date(meeting.meetingDate);
            const formattedDate = dateObj.toLocaleDateString("en-US", {
              day: "numeric",
              month: "short",
              year: "numeric",
              hour: "2-digit",
              minute: "2-digit",
            });

            return (
              <div
                key={meeting._id}
                className="bg-white rounded-2xl border border-slate-200 shadow-sm hover:shadow-lg transition flex flex-col justify-between"
              >
                {/* Header */}
                <div className="p-5 border-b flex justify-between items-start">
                  <div className="min-w-0 flex-1">
                    <h3 className="font-bold text-lg text-slate-805 truncate pr-2" title={meeting.title}>
                      {meeting.title}
                    </h3>
                    <span className="inline-flex items-center gap-1 mt-2 px-3 py-1 rounded-full bg-green-100 text-green-700 text-xs font-semibold">
                      <CheckCircle2 size={14} />
                      Completed
                    </span>
                  </div>
                  {onDelete && (
                    <button
                      onClick={() => onDelete(meeting._id)}
                      className="p-1.5 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors flex-shrink-0"
                      title="Delete Meeting Record"
                    >
                      <Trash2 size={18} />
                    </button>
                  )}
                </div>

                {/* Body */}
                <div className="p-5 space-y-3 flex-1">
                  <div className="flex items-center gap-2 text-slate-600 text-sm font-semibold">
                    <CalendarDays size={18} className="text-violet-500" />
                    {formattedDate}
                  </div>
                  <div className="text-xs text-slate-500 font-semibold">
                    Host: 
                    <span className="font-bold text-slate-700 ml-1">
                      {meeting.createdBy?.name || "User"}
                    </span>
                  </div>
                </div>

                {/* Footer buttons */}
                <div className="border-t p-4 flex gap-3 flex-shrink-0">
                  <button
                    onClick={() => navigate("/recordings")}
                    className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl bg-violet-600 hover:bg-violet-750 text-white transition text-sm font-semibold shadow-sm"
                  >
                    <PlayCircle size={16} />
                    Recording
                  </button>

                  <button
                    onClick={() => navigate("/notes")}
                    className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 transition text-sm font-semibold"
                  >
                    <FileText size={16} />
                    Notes
                  </button>
                </div>

              </div>
            );
          })}
        </div>
      )}

    </section>
  );
};

export default Completed;