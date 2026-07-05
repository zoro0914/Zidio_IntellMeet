import React from 'react';
import { Search, UserCheck, Shield, Trash2, Edit2, Ban, CheckCircle } from 'lucide-react';

const UserTable = ({ users, onEdit, onToggleBlock, onDelete, onChangeRole }) => {
  return (
    <div className="bg-slate-950/60 border border-slate-800/60 rounded-2xl shadow-xl overflow-hidden flex flex-col">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse text-xs">
          <thead>
            <tr className="bg-slate-955 bg-slate-950/80 border-b border-slate-800 text-slate-400 font-bold uppercase tracking-wider text-[9px]">
              <th className="p-4">Name</th>
              <th className="p-4">Email</th>
              <th className="p-4">Department / Job</th>
              <th className="p-4">Role Permission</th>
              <th className="p-4">Status</th>
              <th className="p-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-850 divide-slate-800/60 text-slate-300 font-medium">
            {users.length > 0 ? (
              users.map((u) => (
                <tr key={u.id} className="hover:bg-slate-900/40 transition-colors">
                  <td className="p-4 font-bold text-white">
                    <span className="block">{u.name}</span>
                    <span className="text-[9px] text-slate-500 font-normal">{u.department}</span>
                  </td>
                  <td className="p-4 text-slate-400">{u.email}</td>
                  <td className="p-4">{u.jobTitle || u.dept || 'Engineering'}</td>
                  <td className="p-4">
                    <select
                      value={u.role?.toLowerCase() || 'user'}
                      onChange={(e) => onChangeRole(u.id, e.target.value)}
                      className="bg-slate-900 border border-slate-800 text-white rounded px-2 py-1 text-[11px] font-bold focus:outline-none focus:border-violet-500 cursor-pointer"
                    >
                      <option value="user">User</option>
                      <option value="admin">Admin</option>
                    </select>
                  </td>
                  <td className="p-4">
                    <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[9px] font-bold ${
                      u.status === 'Active' 
                        ? 'bg-emerald-500/10 text-emerald-450 border border-emerald-500/20 text-emerald-400' 
                        : 'bg-red-500/10 text-red-450 border border-red-500/20 text-red-450 text-red-400'
                    }`}>
                      <span className={`w-1.5 h-1.5 rounded-full ${u.status === 'Active' ? 'bg-emerald-400' : 'bg-red-400'}`} />
                      {u.status}
                    </span>
                  </td>
                  <td className="p-4 text-right flex justify-end gap-1 items-center mt-1 border-0">
                    <button 
                      onClick={() => onEdit(u)}
                      className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800/80 transition"
                      title="Edit user details"
                    >
                      <Edit2 size={13} />
                    </button>
                    <button 
                      onClick={() => onToggleBlock(u.id)}
                      className={`p-1.5 rounded-lg transition ${
                        u.status === 'Active' 
                          ? 'text-amber-500 hover:bg-amber-500/10' 
                          : 'text-emerald-500 hover:bg-emerald-500/10'
                      }`}
                      title={u.status === 'Active' ? 'Block user' : 'Unblock user'}
                    >
                      {u.status === 'Active' ? <Ban size={13} /> : <CheckCircle size={13} />}
                    </button>
                    <button 
                      onClick={() => onDelete(u)}
                      className="p-1.5 rounded-lg text-slate-400 hover:text-red-400 hover:bg-red-500/10 transition"
                      title="Delete user account"
                    >
                      <Trash2 size={13} />
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="6" className="p-12 text-center text-slate-500 font-bold">
                  No users found in database directory.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default UserTable;
