import React from 'react';
import { 
  LayoutDashboard, 
  Users, 
  Video, 
  PlayCircle, 
  FileText,
  Brain, 
  TrendingUp, 
  HardDrive, 
  Settings, 
  LogOut, 
  X, 
  ShieldAlert 
} from 'lucide-react';

const Sidebar = ({ activeTab, setActiveTab, sidebarOpen, setSidebarOpen, onLogout }) => {
  const menuItems = [
    { id: 'dashboard', name: 'Dashboard', icon: LayoutDashboard },
    { id: 'users', name: 'User Management', icon: Users },
    { id: 'meetings', name: 'Meeting Management', icon: Video },
    { id: 'recordings', name: 'Recording Management', icon: PlayCircle },
    { id: 'notes', name: 'Note Management', icon: FileText },
    { id: 'ai', name: 'AI Management', icon: Brain },
    { id: 'analytics', name: 'Analytics', icon: TrendingUp },
    { id: 'storage', name: 'Storage Management', icon: HardDrive },
    { id: 'settings', name: 'Settings', icon: Settings }
  ];

  return (
    <aside className={`fixed inset-y-0 left-0 z-50 w-64 bg-slate-950 border-r border-slate-800/80 flex flex-col transform transition-transform duration-300 lg:translate-x-0 lg:static ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
      {/* Logo */}
      <div className="p-6 border-b border-slate-800 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-violet-600 flex items-center justify-center shadow-lg shadow-violet-500/20">
            <ShieldAlert size={20} className="text-white animate-pulse" />
          </div>
          <div>
            <h1 className="text-lg font-black tracking-tight text-white">Intell<span className="text-violet-500">Admin</span></h1>
            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Control Center</p>
          </div>
        </div>
        <button onClick={() => setSidebarOpen(false)} className="lg:hidden text-slate-400 hover:text-white">
          <X size={18} />
        </button>
      </div>

      {/* Navigation Items */}
      <nav className="flex-1 p-4 space-y-1.5 overflow-y-auto">
        {menuItems.map((item) => {
          const Icon = item.icon;
          return (
            <button
              key={item.id}
              onClick={() => {
                setActiveTab(item.id);
                setSidebarOpen(false);
              }}
              className={`w-full flex items-center gap-3.5 px-4 py-3 rounded-xl text-xs font-bold transition-all ${
                activeTab === item.id 
                  ? "bg-gradient-to-r from-violet-600 to-indigo-650 text-white shadow-md shadow-violet-500/10" 
                  : "text-slate-400 hover:bg-slate-900 hover:text-white"
              }`}
            >
              <Icon size={16} />
              {item.name}
            </button>
          );
        })}
      </nav>

      {/* Footer Info */}
      <div className="p-5 border-t border-slate-800 flex items-center gap-3.5 bg-slate-950/80">
        <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-violet-500 to-indigo-650 flex items-center justify-center text-xs font-black text-white">
          HK
        </div>
        <div className="flex-1 min-w-0">
          <h4 className="text-xs font-bold text-white truncate">Harsh kumar</h4>
          <p className="text-[10px] text-slate-400 truncate">Platform Administrator</p>
        </div>
        <button 
          onClick={onLogout}
          title="Logout" 
          className="text-slate-400 hover:text-red-400 transition-colors"
        >
          <LogOut size={16} />
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
