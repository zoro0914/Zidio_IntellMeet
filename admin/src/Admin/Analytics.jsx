import React, { useState, useEffect } from 'react';
import { LineChart, BarChart } from '../components/Admin/Charts';
import { Trophy, Clock, UserCheck, TrendingUp, Sparkles } from 'lucide-react';
import api from '../Utils/api';

const Analytics = () => {
  const [topActiveUsers, setTopActiveUsers] = useState([]);
  const [insights, setInsights] = useState({
    avgDuration: "35.4 mins",
    newUsersCount: 0,
    aiSummaryRate: "0.0 %"
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        setLoading(true);
        const res = await api.get("/admin/analytics");
        if (res.data.success) {
          setTopActiveUsers(res.data.topActiveUsers);
          setInsights(res.data.insights);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchAnalytics();
  }, []);

  return (
    <div className="space-y-6">
      
      {/* Charts section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <LineChart data={[15, 22, 19, 32, 28, 41, 35]} labels={['Week 1', 'Week 2', 'Week 3', 'Week 4', 'Week 5', 'Week 6', 'Week 7']} />
        <BarChart data={[42, 65, 58, 72, 85, 96, 110]} labels={['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul']} />
      </div>

      {/* Analytics specs details */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Most active users leaderboards */}
        <div className="bg-slate-950/60 border border-slate-800/60 rounded-2xl p-6 shadow-xl lg:col-span-2 space-y-4">
          <h3 className="text-sm font-bold text-white mb-2 flex items-center gap-2">
            <Trophy size={16} className="text-amber-500" />
            Most Active User Leaderboard
          </h3>
          
          <div className="overflow-x-auto">
            {loading ? (
              <div className="p-12 flex flex-col items-center justify-center text-slate-400 text-xs gap-3">
                <div className="w-8 h-8 rounded-full border-2 border-slate-850 border-t-violet-600 animate-spin" />
                <span>Computing user activity ranks...</span>
              </div>
            ) : (
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="bg-slate-955 bg-slate-950/80 border-b border-slate-850 text-slate-400 font-bold uppercase tracking-wider text-[9px]">
                    <th className="p-3">Rank</th>
                    <th className="p-3">Member Details</th>
                    <th className="p-3">Conference Created</th>
                    <th className="p-3">Total Time Spent</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60 text-slate-300 font-medium">
                  {topActiveUsers.map((u) => (
                    <tr key={u.rank} className="hover:bg-slate-900/40 transition-colors">
                      <td className="p-3 font-bold text-white flex items-center gap-1.5 mt-1 border-0">
                        <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-black ${
                          u.rank === 1 ? 'bg-amber-500/20 text-amber-500' : 'bg-slate-800 text-slate-400'
                        }`}>
                          {u.rank}
                        </span>
                      </td>
                      <td className="p-3 font-bold text-white">
                        <span className="block">{u.name}</span>
                        <span className="text-[9px] text-slate-500 font-normal">{u.email}</span>
                      </td>
                      <td className="p-3 text-slate-400">{u.meetingsCount} meetings</td>
                      <td className="p-3 font-mono font-bold text-violet-400">{u.durationTotal}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>

        {/* Analytics stats info */}
        <div className="bg-slate-950/60 border border-slate-800/60 rounded-2xl p-6 shadow-xl space-y-4">
          <h3 className="text-sm font-bold text-white mb-2 flex items-center gap-2">
            <TrendingUp size={16} className="text-violet-500" />
            Performance Insights
          </h3>

          <div className="space-y-3.5 text-xs">
            <div className="p-3.5 rounded-xl border border-slate-800 bg-slate-900/50 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Clock size={16} className="text-violet-500" />
                <span className="text-slate-400">Avg Duration</span>
              </div>
              <span className="font-bold text-white">{insights.avgDuration}</span>
            </div>
            
            <div className="p-3.5 rounded-xl border border-slate-800 bg-slate-900/50 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <UserCheck size={16} className="text-emerald-500" />
                <span className="text-slate-400">New Users (Month)</span>
              </div>
              <span className="font-bold text-white">+{insights.newUsersCount} users</span>
            </div>

            <div className="p-3.5 rounded-xl border border-slate-800 bg-slate-900/50 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Sparkles size={16} className="text-indigo-500" />
                <span className="text-slate-400">AI Summary Rate</span>
              </div>
              <span className="font-bold text-white">{insights.aiSummaryRate}</span>
            </div>
          </div>
        </div>

      </div>

    </div>
  );
};

export default Analytics;
