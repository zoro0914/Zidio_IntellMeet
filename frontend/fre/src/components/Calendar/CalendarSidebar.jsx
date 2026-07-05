import React from "react";
import { CalendarDays, Video, Loader } from "lucide-react";

const CalendarSidebar = ({
  selectedDate,
  loading,
  activeDateEvents,
  onScheduleClick,
  onJoinClick,
}) => {
  return (
    <div className="bg-white border border-gray-200 rounded-2xl flex flex-col overflow-hidden shadow-sm h-full">
      
      {/* Header */}
      <div className="px-5 py-4 border-b bg-slate-50 flex items-center justify-between flex-shrink-0">
        <div className="flex items-center gap-2">
          <CalendarDays className="text-violet-600" size={20} />
          <div>
            <h3 className="font-bold text-slate-900 text-sm">Selected Day Agenda</h3>
            <p className="text-[10px] text-slate-400 font-semibold mt-0.5">Manage details and join meetings</p>
          </div>
        </div>
      </div>

      {/* Body Content */}
      <div className="flex-1 overflow-y-auto p-5 space-y-4 min-h-0">
        <div className="bg-violet-50/30 border border-violet-100 rounded-xl p-4">
          <span className="text-[10px] font-bold text-violet-600 uppercase tracking-wider">Focused date</span>
          <p className="font-bold text-slate-800 text-sm mt-1">
            {selectedDate.toLocaleDateString("en-US", {
              weekday: "long",
              month: "long",
              day: "numeric",
              year: "numeric",
            })}
          </p>
        </div>

        {loading ? (
          <div className="py-20 text-center">
            <Loader className="mx-auto animate-spin text-violet-650 mb-3" size={28} />
            <p className="text-slate-400 text-xs font-bold">Refreshing logs...</p>
          </div>
        ) : activeDateEvents.length === 0 ? (
          <div className="py-20 text-center border border-dashed rounded-xl border-slate-200">
            <CalendarDays className="mx-auto text-slate-300 mb-3" size={36} />
            <p className="text-slate-400 text-xs font-bold">No meetings scheduled for this day.</p>
            <button
              onClick={onScheduleClick}
              className="mt-3 text-xs text-violet-600 hover:text-violet-750 font-bold hover:underline"
            >
              Schedule Call Now
            </button>
          </div>
        ) : (
          <div className="space-y-3.5">
            {activeDateEvents.map((ev) => (
              <div
                key={ev._id}
                className="bg-white border rounded-xl p-4 space-y-4 hover:shadow-md transition duration-300"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-violet-50 text-violet-605 flex items-center justify-center flex-shrink-0">
                    <Video size={20} />
                  </div>
                  <div className="min-w-0">
                    <p className="font-bold text-slate-800 text-sm truncate" title={ev.title}>
                      {ev.title}
                    </p>
                    <p className="text-[10px] text-slate-400 font-semibold mt-0.5">
                      Hosted by {ev.createdBy?.name || "User"}
                    </p>
                  </div>
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={() => onJoinClick(ev.meetingLink)}
                    className="flex-1 bg-violet-600 hover:bg-violet-750 text-white font-bold text-xs py-2 rounded-lg text-center"
                  >
                    Join Room
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Footer banner */}
      <div className="p-4 bg-slate-50 border-t text-[10px] text-slate-400 leading-normal font-medium text-center">
        💡 Highlighted cell markers indicate scheduled dynamic rooms. Click any day to list detail controls.
      </div>

    </div>
  );
};

export default CalendarSidebar;
