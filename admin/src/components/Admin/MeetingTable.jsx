import React from 'react';
import { Calendar, Trash2, Eye, XCircle } from 'lucide-react';

const MeetingTable = ({ meetings, onViewDetails, onCancel, onDelete }) => {
  return (
    <div className="bg-slate-950/60 border border-slate-800/60 rounded-2xl shadow-xl overflow-hidden flex flex-col">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse text-xs">
          <thead>
            <tr className="bg-slate-955 bg-slate-950/80 border-b border-slate-800 text-slate-400 font-bold uppercase tracking-wider text-[9px]">
              <th className="p-4">Meeting Title & ID</th>
              <th className="p-4">Host (Created By)</th>
              <th className="p-4">Participants</th>
              <th className="p-4">Duration</th>
              <th className="p-4">Status</th>
              <th className="p-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-850 divide-slate-800/60 text-slate-300 font-medium">
            {meetings.length > 0 ? (
              meetings.map((m) => (
                <tr key={m.id} className="hover:bg-slate-900/40 transition-colors">
                  <td className="p-4 font-bold text-white">
                    <span className="block">{m.title}</span>
                    <div className="flex flex-col gap-0.5 mt-1 font-normal">
                      <span className="text-[9px] text-violet-400 font-bold">
                        Meeting Code: {m.meetingLink ? (m.meetingLink.includes('/') ? m.meetingLink.split('/').pop() : m.meetingLink) : 'N/A'}
                      </span>
                      <span className="text-[9px] text-slate-500 font-mono">DB ID: {m.id}</span>
                      <span className="text-[9px] text-slate-500 flex items-center gap-1">
                        <Calendar size={10} />
                        {new Date(m.createdAt || m.date).toLocaleString()}
                      </span>
                    </div>
                  </td>
                  <td className="p-4">
                    <span className="block text-slate-200">{m.hostName || m.createdBy?.name || 'Unknown'}</span>
                    <span className="text-[9px] text-slate-500 font-normal">{m.hostEmail || m.createdBy?.email}</span>
                  </td>
                  <td className="p-4 text-slate-400">
                    {m.participantsCount || m.participants?.length || 1} members
                  </td>
                  <td className="p-4">{m.duration || '00:45:00'}</td>
                  <td className="p-4">
                    <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[9px] font-bold ${
                      m.status === 'Completed' 
                        ? 'bg-slate-800 border border-slate-700 text-slate-400' 
                        : m.status === 'Cancelled'
                          ? 'bg-red-500/10 border border-red-500/20 text-red-400'
                          : 'bg-emerald-500/10 border border-emerald-500/20 text-emerald-400'
                    }`}>
                      <span className={`w-1.5 h-1.5 rounded-full ${
                        m.status === 'Completed' 
                          ? 'bg-slate-400' 
                          : m.status === 'Cancelled'
                            ? 'bg-red-400'
                            : 'bg-emerald-450 bg-emerald-400 animate-pulse'
                      }`} />
                      {m.status || 'Completed'}
                    </span>
                  </td>
                  <td className="p-4 text-right flex justify-end gap-1.5 items-center mt-3 border-0">
                    <button 
                      onClick={() => onViewDetails(m)}
                      className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800/80 transition"
                      title="View meeting details"
                    >
                      <Eye size={13} />
                    </button>
                    {m.status === 'Upcoming' && onCancel && (
                      <button 
                        onClick={() => onCancel(m)}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-amber-400 hover:bg-amber-500/10 transition"
                        title="Cancel Scheduled Meeting"
                      >
                        <XCircle size={13} />
                      </button>
                    )}
                    <button 
                      onClick={() => onDelete(m)}
                      className="p-1.5 rounded-lg text-slate-400 hover:text-red-400 hover:bg-red-500/10 transition"
                      title="Delete meeting logs"
                    >
                      <Trash2 size={13} />
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="6" className="p-12 text-center text-slate-500 font-bold">
                  No meeting registries available.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default MeetingTable;
