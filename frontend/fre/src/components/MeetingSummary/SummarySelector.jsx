import React from "react";

const SummarySelector = ({ selectedMeetingId, setSelectedMeetingId, meetings }) => {
  return (
    <div className="bg-white border border-gray-250 rounded-2xl p-5 shadow-sm space-y-2 max-w-xl">
      <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block">
        Select Completed Meeting
      </label>
      <select
        value={selectedMeetingId}
        onChange={(e) => setSelectedMeetingId(e.target.value)}
        className="w-full px-4 py-3 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-violet-500 bg-slate-50 text-sm font-semibold transition text-slate-700"
      >
        <option value="">📂 Choose Meeting summary context...</option>
        {meetings.map((m) => (
          <option key={m._id} value={m._id}>
            📹 {m.title} ({new Date(m.meetingDate).toLocaleDateString()})
          </option>
        ))}
      </select>
    </div>
  );
};

export default SummarySelector;
