import React from "react";
import { Video, Calendar, ShieldCheck } from "lucide-react";

const ProfileStats = ({ meetingCount, workspaceCount = 1 }) => {
  const cards = [
    {
      title: "Meetings Attended",
      value: meetingCount,
      description: "Sessions conducted by user",
      icon: <Video size={20} className="text-violet-650" />,
      bg: "bg-violet-50/50 border-violet-100",
    },
    {
      title: "Default Workspaces",
      value: workspaceCount,
      description: "Assigned team workspaces",
      icon: <ShieldCheck size={20} className="text-emerald-650" />,
      bg: "bg-emerald-50/30 border-emerald-100",
    },
  ];

  return (
    <div className="p-6 border-t border-gray-100">
      <div className="border-b pb-4 mb-4">
        <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider">Workspace Summary</h3>
        <p className="text-xs text-slate-400 font-semibold mt-0.5">Statistical metrics of your call activities</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        {cards.map((card, index) => (
          <div
            key={index}
            className={`border rounded-2xl p-5 flex items-center justify-between shadow-sm hover:shadow-md transition ${card.bg}`}
          >
            <div className="space-y-1">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">
                {card.title}
              </span>
              <span className="text-2xl font-extrabold text-slate-850 block">
                {card.value}
              </span>
              <span className="text-[10px] text-slate-400 font-semibold block">
                {card.description}
              </span>
            </div>

            <div className="w-11 h-11 bg-white border rounded-xl flex items-center justify-center shadow-sm">
              {card.icon}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProfileStats;
