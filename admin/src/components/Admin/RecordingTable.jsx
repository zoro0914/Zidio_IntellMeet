import React from 'react';
import { PlayCircle, Download, Trash2, Cpu, HardDrive } from 'lucide-react';

const RecordingTable = ({ recordings, onPlay, onDownload, onDelete }) => {
  return (
    <div className="bg-slate-950/60 border border-slate-800/60 rounded-2xl shadow-xl overflow-hidden flex flex-col">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse text-xs">
          <thead>
            <tr className="bg-slate-955 bg-slate-950/80 border-b border-slate-800 text-slate-400 font-bold uppercase tracking-wider text-[9px]">
              <th className="p-4">Recording Details</th>
              <th className="p-4">Duration</th>
              <th className="p-4">File Size</th>
              <th className="p-4">AI Summarization Status</th>
              <th className="p-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-850 divide-slate-800/60 text-slate-300 font-medium">
            {recordings.length > 0 ? (
              recordings.map((r) => (
                <tr key={r.id} className="hover:bg-slate-900/40 transition-colors">
                  <td className="p-4 font-bold text-white">
                    <span className="block">{r.title || r.meetingTitle}</span>
                    <span className="text-[9px] text-slate-500 font-normal block mt-0.5">ID: {r.id || r._id}</span>
                  </td>
                  <td className="p-4 text-slate-400">{r.duration || '00:30:15'}</td>
                  <td className="p-4 flex items-center gap-1.5 mt-3 text-slate-200 border-0">
                    <HardDrive size={12} className="text-slate-500" />
                    {r.size || '45 MB'}
                  </td>
                  <td className="p-4">
                    <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[9px] font-bold ${
                      r.aiStatus === 'Processed' 
                        ? 'bg-emerald-500/10 border border-emerald-500/20 text-emerald-450 text-emerald-450 text-emerald-450 text-emerald-400' 
                        : 'bg-amber-500/10 border border-amber-500/20 text-amber-405 text-amber-400'
                    }`}>
                      <Cpu size={10} />
                      {r.aiStatus || 'Processed'}
                    </span>
                  </td>
                  <td className="p-4 text-right flex justify-end gap-1 items-center mt-3 border-0">
                    <button 
                      onClick={() => onPlay(r)}
                      className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800/80 transition"
                      title="Play Recording"
                    >
                      <PlayCircle size={13} />
                    </button>
                    <button 
                      onClick={() => onDownload(r)}
                      className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800/80 transition"
                      title="Download Recording"
                    >
                      <Download size={13} />
                    </button>
                    <button 
                      onClick={() => onDelete(r)}
                      className="p-1.5 rounded-lg text-slate-400 hover:text-red-400 hover:bg-red-500/10 transition"
                      title="Delete Recording"
                    >
                      <Trash2 size={13} />
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5" className="p-12 text-center text-slate-500 font-bold">
                  No recording archives registered.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default RecordingTable;
