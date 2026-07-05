import React from "react";
import {
  CalendarDays,
  XCircle,
  RotateCcw,
  Trash2,
} from "lucide-react";

const Cancelled = ({ meetings = [], onDelete, onReschedule }) => {
  return (
    <section className="mt-10">
      
      {/* Heading */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-slate-800">
          Cancelled Meetings
        </h2>
      </div>

      {/* Cards */}
      {meetings.length === 0 ? (
        <div className="bg-white rounded-2xl border border-slate-200 p-8 text-center text-slate-505 shadow-sm font-semibold">
          No cancelled meetings.
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
                  <div>
                    <h3 className="text-lg font-bold text-slate-800 truncate max-w-[200px]" title={meeting.title}>
                      {meeting.title}
                    </h3>
                    <span className="inline-flex items-center gap-1 mt-2 px-3 py-1 rounded-full bg-red-100 text-red-600 text-xs font-semibold">
                      <XCircle size={14} />
                      Cancelled
                    </span>
                  </div>
                </div>

                {/* Body */}
                <div className="p-5 space-y-3 flex-1">
                  <div className="flex items-center gap-2 text-slate-600 text-sm font-semibold">
                    <CalendarDays size={18} className="text-rose-500" />
                    {formattedDate}
                  </div>
                  <div className="text-sm">
                    <span className="font-semibold text-slate-700">Reason:</span>
                    <p className="text-slate-500 mt-1 text-xs leading-relaxed font-semibold">
                      {meeting.description || "No reason specified"}
                    </p>
                  </div>
                </div>

                {/* Footer buttons */}
                <div className="border-t p-4 flex gap-3 flex-shrink-0">
                  <button
                    onClick={() => onReschedule(meeting)}
                    className="flex-1 flex items-center justify-center gap-2 py-2.5 bg-violet-600 hover:bg-violet-750 text-white rounded-xl transition text-sm font-semibold shadow-sm animate-pulse"
                  >
                    <RotateCcw size={16} />
                    Reschedule
                  </button>

                  <button
                    onClick={() => onDelete(meeting._id)}
                    className="flex-1 flex items-center justify-center gap-2 border border-red-200 text-red-650 hover:bg-red-50 py-2.5 rounded-xl transition text-sm font-semibold"
                  >
                    <Trash2 size={16} />
                    Delete
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

export default Cancelled;