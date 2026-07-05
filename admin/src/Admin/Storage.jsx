import React, { useState, useEffect } from 'react';
import { HardDrive, Trash2, Calendar, FileText, ChevronRight, AlertCircle } from 'lucide-react';
import DeleteModal from '../components/Admin/DeleteModal';
import api from '../Utils/api';

const Storage = () => {
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalMeetings: 0,
    totalTeams: 0,
    totalSizeUsed: 0
  });

  const [recordings, setRecordings] = useState([]);

  const [deleteTarget, setDeleteTarget] = useState(null);

  const fetchStats = async () => {
    try {
      const res = await api.get("/admin/stats");
      if (res.data.success) {
        setStats(res.data.stats);
      }

      const meetingsRes = await api.get("/meetings");
      if (meetingsRes.data.success) {
        const formatted = meetingsRes.data.meetings.map(m => ({
          id: m._id,
          _id: m._id,
          title: m.title,
          date: m.meetingDate,
          host: m.createdBy?.name || "Unknown",
          size: m.size ? `${m.size} MB` : "45 MB",
          sizeVal: m.size || 45
        }));
        setRecordings(formatted);
      }
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  const totalUsedMb = stats.totalSizeUsed || (recordings.reduce((sum, r) => sum + r.sizeVal, 0));
  const capacityPct = Math.min(Math.round((totalUsedMb / 5120) * 100), 100); // 5GB limit = 5120MB

  const totalUsedStr = totalUsedMb >= 1024 
    ? `${(totalUsedMb / 1024).toFixed(2)} GB`
    : `${totalUsedMb} MB`;

  const handleDeleteTrigger = (rec) => {
    setDeleteTarget(rec);
  };

  const handleConfirmDelete = async () => {
    try {
      const targetId = deleteTarget._id || deleteTarget.id;
      const res = await api.delete(`/meetings/${targetId}`);
      if (res.data.success) {
        await fetchStats();
      }
    } catch (err) {
      console.error(err);
    } finally {
      setDeleteTarget(null);
    }
  };

  const handlePruneOld = async () => {
    const thirtyDaysAgo = Date.now() - 30 * 24 * 60 * 60 * 1000;
    const oldRecordings = recordings.filter(r => new Date(r.date).getTime() < thirtyDaysAgo);
    
    if (oldRecordings.length === 0) {
      alert("No recordings older than 30 days found.");
      return;
    }
    
    if (confirm(`Are you sure you want to prune ${oldRecordings.length} recordings older than 30 days?`)) {
      try {
        for (const rec of oldRecordings) {
          await api.delete(`/meetings/${rec.id}`);
        }
        alert("Completed automatic pruning cleanup.");
        await fetchStats();
      } catch (err) {
        console.error(err);
        alert("Failed to prune some old records.");
      }
    }
  };

  return (
    <div className="space-y-6 text-slate-100">
      
      {/* Storage load status summary */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        <div className="bg-slate-950/60 border border-slate-800/60 rounded-2xl p-6 shadow-xl lg:col-span-2 space-y-4">
          <h3 className="text-sm font-bold text-white mb-2 flex items-center gap-2">
            <HardDrive size={16} className="text-violet-500" />
            Cloud Storage Volume details
          </h3>

          <div className="space-y-4">
            <div className="flex justify-between items-center text-xs">
              <span className="text-slate-400">System capacity allocated: 5.0 GB</span>
              <span className="font-bold text-violet-400">{totalUsedStr} Used ({capacityPct}%)</span>
            </div>
            
            {/* Custom progress bars */}
            <div className="w-full h-3 bg-slate-900 border border-slate-800 rounded-full overflow-hidden">
              <div className="h-full bg-gradient-to-r from-violet-600 to-indigo-650 rounded-full transition-all" style={{ width: `${capacityPct}%` }} />
            </div>

            <div className="flex gap-4 text-[10px] text-slate-500 font-bold uppercase tracking-wider">
              <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-violet-605 bg-violet-600" />Recordings (84%)</span>
              <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-indigo-500" />Transcripts & Summaries (12%)</span>
              <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-slate-800" />Metadata Cache (4%)</span>
            </div>
          </div>
        </div>

        {/* Storage pruning card */}
        <div className="bg-slate-950/60 border border-slate-800/60 rounded-2xl p-6 shadow-xl flex flex-col justify-between space-y-4">
          <div>
            <h3 className="text-sm font-bold text-white mb-1.5 flex items-center gap-1.5">
              <AlertCircle size={16} className="text-amber-500" />
              Automated Pruning Tools
            </h3>
            <p className="text-xs text-slate-500 leading-normal">
              Quickly release platform cloud capacities by removing outdated meeting logs.
            </p>
          </div>
          <button
            onClick={handlePruneOld}
            className="w-full py-2.5 rounded-xl text-white bg-slate-900 border border-slate-800 hover:bg-slate-850 hover:border-slate-700 transition text-xs font-bold flex items-center justify-center gap-1.5 cursor-pointer animate-pulse"
          >
            <Trash2 size={13} />
            Prune 30 Days Old Logs
          </button>
        </div>

      </div>

      {/* Largest recordings files checklist */}
      <div className="bg-slate-950/60 border border-slate-800/60 rounded-2xl p-6 shadow-xl space-y-4">
        <h3 className="text-sm font-bold text-white mb-2 flex items-center gap-2">
          <HardDrive size={16} className="text-violet-500" />
          Largest Media Files Registry
        </h3>

        <div className="divide-y divide-slate-800">
          {recordings.map((rec) => (
            <div key={rec.id} className="py-4 first:pt-0 last:pb-0 flex items-center justify-between gap-4 text-xs">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-center text-slate-500">
                  <FileText size={18} />
                </div>
                <div>
                  <h4 className="font-bold text-white leading-tight">{rec.title}</h4>
                  <p className="text-[10px] text-slate-500 mt-1">Host: {rec.host} | Date: {new Date(rec.date).toLocaleDateString()}</p>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <span className="font-mono font-bold text-slate-300">{rec.size}</span>
                <button
                  onClick={() => handleDeleteTrigger(rec)}
                  className="p-2 rounded-xl text-slate-400 hover:text-red-400 hover:bg-red-500/10 transition"
                  title="Delete Recording"
                >
                  <Trash2 size={14} />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      <DeleteModal 
        isOpen={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleConfirmDelete}
        title="Delete Large Recording?"
        message={deleteTarget ? `Are you sure you want to permanently delete "${deleteTarget.title}" (${deleteTarget.size})? This operation cannot be undone.` : ''}
      />
    </div>
  );
};

export default Storage;
