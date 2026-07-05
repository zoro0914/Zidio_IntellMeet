import React from "react";
import { Video, Users, CheckSquare, Clock } from "lucide-react";

const StatsSummary = ({ stats }) => {
  const cards = [
    {
      label: "Total Meetings",
      value: stats.totalMeetings,
      icon: <Video size={20} />,
      color: "bg-blue-50 text-blue-600 border-blue-100",
    },
    {
      label: "Average Participants",
      value: stats.avgParticipants,
      icon: <Users size={20} />,
      color: "bg-violet-50 text-violet-600 border-violet-100",
    },
    {
      label: "Action Items Generated",
      value: stats.totalActions,
      icon: <CheckSquare size={20} />,
      color: "bg-amber-50 text-amber-600 border-amber-100",
    },
    {
      label: "Completed Sessions",
      value: stats.completedMeetings,
      icon: <Clock size={20} />,
      color: "bg-emerald-50 text-emerald-600 border-emerald-100",
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      {cards.map((card, index) => (
        <div
          key={index}
          className="bg-white border rounded-2xl p-6 flex items-center justify-between shadow-sm hover:shadow-md transition"
        >
          <div className="space-y-1">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">
              {card.label}
            </span>
            <span className="text-3xl font-extrabold text-slate-800 block">
              {card.value}
            </span>
          </div>

          <div className={`w-12 h-12 rounded-xl flex items-center justify-center border ${card.color}`}>
            {card.icon}
          </div>
        </div>
      ))}
    </div>
  );
};

export default StatsSummary;
