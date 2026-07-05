import React from "react";

const CalendarGrid = ({
  year,
  month,
  daysInMonth,
  startDayOfWeek,
  selectedDate,
  onDaySelect,
  getEventsForDate,
}) => {
  const renderCells = () => {
    const cells = [];
    
    // Previous Month offsets empty cells
    for (let i = 0; i < startDayOfWeek; i++) {
      cells.push(
        <div
          key={`offset-${i}`}
          className="h-28 border border-gray-100 bg-slate-50/20 text-slate-350 p-2 select-none"
        />
      );
    }

    // Days in current Month
    for (let d = 1; d <= daysInMonth; d++) {
      const checkDate = new Date(year, month, d);
      const isSelected = selectedDate.toDateString() === checkDate.toDateString();
      const isToday = new Date().toDateString() === checkDate.toDateString();
      
      const dayEvents = getEventsForDate(checkDate);

      cells.push(
        <div
          key={`day-${d}`}
          onClick={() => onDaySelect(d)}
          className={`h-28 border border-gray-100 p-2 cursor-pointer transition flex flex-col justify-between hover:bg-violet-50/30 ${
            isSelected ? "ring-2 ring-violet-650 bg-violet-50/10" : ""
          } ${isToday ? "bg-slate-50" : ""}`}
        >
          <div className="flex justify-between items-center">
            <span className={`text-sm font-bold ${
              isToday ? "bg-violet-600 text-white w-6 h-6 rounded-full flex items-center justify-center text-xs" : "text-slate-705"
            }`}>
              {d}
            </span>
            {dayEvents.length > 0 && (
              <span className="w-2.5 h-2.5 rounded-full bg-violet-600 animate-pulse" />
            )}
          </div>

          <div className="space-y-1 overflow-hidden">
            {dayEvents.slice(0, 2).map((ev) => (
              <div
                key={ev._id}
                className="text-[10px] px-1.5 py-0.5 rounded bg-violet-100 text-violet-700 font-bold truncate"
                title={ev.title}
              >
                📹 {ev.title}
              </div>
            ))}
            {dayEvents.length > 2 && (
              <div className="text-[8px] text-slate-400 font-semibold pl-1">
                + {dayEvents.length - 2} more
              </div>
            )}
          </div>

        </div>
      );
    }

    return cells;
  };

  return (
    <div className="flex-1 flex flex-col min-h-0 bg-white">
      {/* Calendar weekdays labels */}
      <div className="grid grid-cols-7 border-b text-center text-xs font-bold text-slate-400 py-2.5 bg-slate-50/50 flex-shrink-0 uppercase tracking-wider">
        <div>Sun</div>
        <div>Mon</div>
        <div>Tue</div>
        <div>Wed</div>
        <div>Thu</div>
        <div>Fri</div>
        <div>Sat</div>
      </div>

      {/* Grid View Cells */}
      <div className="flex-1 overflow-y-auto min-h-0 grid grid-cols-7">
        {renderCells()}
      </div>
    </div>
  );
};

export default CalendarGrid;
