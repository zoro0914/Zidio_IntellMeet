import React from 'react';
import { Menu, Bell } from 'lucide-react';

const Header = ({ title, setSidebarOpen }) => {
  return (
    <header className="h-16 border-b border-slate-800/80 bg-slate-955 bg-slate-950/50 flex items-center justify-between px-6 sticky top-0 backdrop-blur z-40">
      <div className="flex items-center gap-4">
        <button onClick={() => setSidebarOpen(true)} className="lg:hidden p-1 rounded hover:bg-slate-850 text-slate-400 hover:text-white">
          <Menu size={20} />
        </button>
        <h2 className="text-sm font-bold text-white uppercase tracking-wider">
          {title}
        </h2>
      </div>

      <div className="flex items-center gap-4">
        <button className="relative p-2 rounded-xl text-slate-400 hover:bg-slate-800 hover:text-white transition">
          <Bell size={16} />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-violet-500" />
        </button>
        <div className="h-5 w-[1px] bg-slate-800" />
        <span className="text-[10px] bg-emerald-500/10 border border-emerald-500/30 text-emerald-450 text-emerald-400 px-2 py-0.5 rounded-full font-bold flex items-center gap-1">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
          API Connected
        </span>
      </div>
    </header>
  );
};

export default Header;
