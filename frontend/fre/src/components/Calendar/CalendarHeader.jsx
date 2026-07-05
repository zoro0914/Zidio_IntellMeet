import React from "react";
import { ChevronLeft, ChevronRight, Plus } from "lucide-react";

const CalendarHeader = ({ monthName, year, onPrevMonth, onNextMonth, onScheduleClick }) => {
  return (
    <div className="px-6 py-4 border-b flex items-center justify-between bg-slate-50 flex-shrink-0">
      <div className="flex items-center gap-4">
        <h2 className="text-xl font-bold text-slate-900">
          {monthName} {year}
        </h2>
        <div className="flex border rounded-lg overflow-hidden bg-white shadow-sm">
          <button
            onClick={onPrevMonth}
            className="p-2 text-slate-650 hover:bg-slate-50 border-r"
          >
            <ChevronLeft size={16} />
          </button>
          <button
            onClick={onNextMonth}
            className="p-2 text-slate-650 hover:bg-slate-50"
          >
            <ChevronRight size={16} />
          </button>
        </div>
      </div>

      <div className="flex gap-2">
        <button
          onClick={onScheduleClick}
          className="bg-violet-600 hover:bg-violet-705 text-white font-bold text-xs px-4 py-2.5 rounded-xl shadow-sm flex items-center gap-1.5"
        >
          <Plus size={14} />
          Schedule Call
        </button>
      </div>
    </div>
  );
};

export default CalendarHeader;
