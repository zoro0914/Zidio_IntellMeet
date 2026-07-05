import React from "react";
import { Search } from "lucide-react";

const SearchMeeting = ({
  searchQuery,
  setSearchQuery,
  statusFilter,
  setStatusFilter,
  dateFilter,
  setDateFilter,
}) => {
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-5">
      <div className="flex flex-col lg:flex-row gap-4">
        
        {/* Search Input bar */}
        <div className="relative flex-1">
          <Search
            size={20}
            className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
          />
          <input
            type="text"
            placeholder="Search meetings by title or meeting ID..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-12 pr-4 py-3 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-violet-500 transition text-sm font-semibold"
          />
        </div>

        {/* Status selection filter */}
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="px-4 py-3 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-violet-500 text-sm font-semibold bg-white"
        >
          <option value="All Status">All Status</option>
          <option value="scheduled">Scheduled</option>
          <option value="completed">Completed</option>
          <option value="cancelled">Cancelled</option>
        </select>

        {/* Date selection filter */}
        <select
          value={dateFilter}
          onChange={(e) => setDateFilter(e.target.value)}
          className="px-4 py-3 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-violet-500 text-sm font-semibold bg-white"
        >
          <option value="All Dates">All Dates</option>
          <option value="Today">Today</option>
          <option value="This Week">This Week</option>
          <option value="This Month">This Month</option>
        </select>

      </div>
    </div>
  );
};

export default SearchMeeting;