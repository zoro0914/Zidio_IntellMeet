import React from "react";
import { Clock, HardDrive, Calendar } from "lucide-react";

const InsightCard = ({ title, value, type, description }) => {
  const getIcon = () => {
    switch (type) {
      case "duration":
        return <Clock size={20} className="text-indigo-500" />;
      case "storage":
        return <HardDrive size={20} className="text-violet-500" />;
      default:
        return <Calendar size={20} className="text-emerald-500" />;
    }
  };

  return (
    <div className="bg-white border border-gray-150 rounded-2xl p-4 shadow-sm flex items-center gap-4">
      <div className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center flex-shrink-0">
        {getIcon()}
      </div>
      <div className="min-w-0">
        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">{title}</span>
        <p className="text-base font-bold text-slate-800 mt-0.5">{value}</p>
        {description && <p className="text-[10px] text-slate-400 truncate mt-0.5">{description}</p>}
      </div>
    </div>
  );
};

export default InsightCard;
