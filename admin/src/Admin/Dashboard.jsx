import React, { useState, useEffect } from 'react';
import api from '../Utils/api';
import { Users, Video, PlayCircle, Cpu, HardDrive, ShieldAlert, Activity } from 'lucide-react';
import StatCard from '../components/Admin/StatCard';
import { LineChart, BarChart } from '../components/Admin/Charts';

const Dashboard = () => {
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalMeetings: 0,
    totalTeams: 0,
    totalSizeUsed: 0
  });

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true);
        const res = await api.get("/admin/stats");
        if (res.data.success) {
          setStats(res.data.stats);
        }
      } catch (err) {
        console.error("Failed to load real MongoDB stats:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  const recentLogs = [
    { id: 1, action: "User Login", detail: "Harsh kumar authorized from local network", time: "Just now" },
    { id: 2, action: "Role Modified", detail: "Role settings adjusted in database", time: "5 mins ago" },
    { id: 3, action: "Meeting Created", detail: "New meeting link generated dynamically", time: "15 mins ago" },
  ];

  const storageUsedStr = stats.totalSizeUsed >= 1024 
    ? `${(stats.totalSizeUsed / 1024).toFixed(2)} GB`
    : `${stats.totalSizeUsed} MB`;

  return (
    <div className="space-y-6">
      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-5">
        <StatCard title="Total Users" value={stats.totalUsers} icon={Users} color="violet" desc="Registered in MongoDB" />
        <StatCard title="Total Meetings" value={stats.totalMeetings} icon={Video} color="emerald" desc="Live or scheduled" />
        <StatCard title="Total Teams" value={stats.totalTeams} icon={PlayCircle} color="amber" desc="Active collaborations" />
        <StatCard title="AI Processed" value={stats.totalMeetings} icon={Cpu} color="indigo" desc="Gemini integrations" />
        <StatCard title="Storage Used" value={storageUsedStr} icon={HardDrive} color="red" desc="Cloud disk usage" />
      </div>

      {/* Analytics Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <LineChart />
        <BarChart />
      </div>

      {/* Core Infrastructure Health & Activity logs */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="bg-slate-950/60 border border-slate-800/60 rounded-2xl p-6 shadow-xl lg:col-span-2 space-y-4">
          <h3 className="text-sm font-bold text-white mb-2 flex items-center gap-2">
            <Activity size={16} className="text-violet-500" />
            Backend Engine Health Status
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
            <div className="p-4 rounded-xl border border-slate-800 bg-slate-900/50">
              <span className="text-[9px] uppercase font-bold text-slate-500">Database Connection</span>
              <h4 className="text-xs font-bold text-white mt-1">MongoDB Atlas</h4>
              <div className="mt-2.5 flex items-center gap-1.5 text-emerald-450 text-emerald-400 font-bold">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                Active Connection
              </div>
            </div>
            <div className="p-4 rounded-xl border border-slate-800 bg-slate-900/50">
              <span className="text-[9px] uppercase font-bold text-slate-500">AI LLM Pipeline</span>
              <h4 className="text-xs font-bold text-white mt-1">Gemini AI API</h4>
              <div className="mt-2.5 flex items-center gap-1.5 text-violet-400 font-bold">
                <span className="w-1.5 h-1.5 rounded-full bg-violet-400 animate-pulse" />
                Live Configured
              </div>
            </div>
            <div className="p-4 rounded-xl border border-slate-800 bg-slate-900/50">
              <span className="text-[9px] uppercase font-bold text-slate-500">Websockets Signaling</span>
              <h4 className="text-xs font-bold text-white mt-1">Socket.io rooms</h4>
              <div className="mt-2.5 flex items-center gap-1.5 text-emerald-400 font-bold">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                Listening Port
              </div>
            </div>
          </div>
        </div>

        <div className="bg-slate-950/60 border border-slate-800/60 rounded-2xl p-6 shadow-xl">
          <h3 className="text-sm font-bold text-white mb-4 flex items-center gap-2">
            <ShieldAlert size={16} className="text-violet-500" />
            Security Audit Log
          </h3>
          <div className="space-y-4">
            {recentLogs.map((log) => (
              <div key={log.id} className="text-xs border-b border-slate-800/60 pb-3 last:border-0 last:pb-0">
                <div className="flex justify-between items-center mb-1">
                  <span className="font-bold text-slate-200">{log.action}</span>
                  <span className="text-[9px] text-slate-500">{log.time}</span>
                </div>
                <p className="text-slate-400 text-[11px] leading-relaxed">{log.detail}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
