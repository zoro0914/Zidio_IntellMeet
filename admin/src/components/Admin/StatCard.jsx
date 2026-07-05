import React from 'react';

const StatCard = ({ title, value, icon: Icon, color = 'violet', desc }) => {
  const colorMap = {
    violet: 'bg-violet-600/10 border-violet-500/30 text-violet-500',
    emerald: 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400',
    amber: 'bg-amber-500/10 border-amber-500/30 text-amber-400',
    indigo: 'bg-indigo-500/10 border-indigo-500/30 text-indigo-400',
    red: 'bg-red-500/10 border-red-500/30 text-red-400'
  };

  return (
    <div className="bg-slate-950/60 border border-slate-800/60 rounded-2xl p-5 shadow-lg flex items-center gap-4 hover:border-slate-700/80 transition-colors">
      <div className={`w-12 h-12 rounded-xl border flex items-center justify-center ${colorMap[color] || colorMap.violet}`}>
        <Icon size={22} />
      </div>
      <div>
        <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">{title}</p>
        <h3 className="text-xl font-black text-white mt-0.5">{value}</h3>
        {desc && <p className="text-[9px] text-slate-500 mt-0.5 leading-normal">{desc}</p>}
      </div>
    </div>
  );
};

export default StatCard;
