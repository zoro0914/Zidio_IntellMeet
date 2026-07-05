import React, { useState, useEffect } from 'react';
import UserTable from '../components/Admin/UserTable';
import DeleteModal from '../components/Admin/DeleteModal';
import api from '../Utils/api';
import { Search, Plus, Eye, X } from 'lucide-react';

const Users = () => {
  const [usersList, setUsersList] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [notification, setNotification] = useState("");

  // Edit states
  const [editingUser, setEditingUser] = useState(null);
  const [editForm, setEditForm] = useState({ name: "", email: "", department: "", jobTitle: "" });

  // Delete states
  const [deleteTarget, setDeleteTarget] = useState(null);

  const showNotification = (msg) => {
    setNotification(msg);
    setTimeout(() => setNotification(""), 4500);
  };

  const fetchUsers = async (query = "") => {
    try {
      setLoading(true);
      const res = await api.get(`/admin/users?q=${encodeURIComponent(query)}`);
      if (res.data.success) {
        setUsersList(res.data.users);
      }
    } catch (err) {
      console.error(err);
      showNotification("Failed to fetch users from database. Displaying local offline data.");
      // Fallback offline mock data
      setUsersList([
        { id: "1", _id: "1", name: "Harsh kumar", email: "hs0037118@gmail.com", role: "admin", department: "Engineering", jobTitle: "Lead Engineer", status: "Active" },
        { id: "2", _id: "2", name: "Sania Malhotra", email: "sania.m@zidio.co", role: "user", department: "Design", jobTitle: "UI Architect", status: "Active" }
      ]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers("");
  }, []);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    fetchUsers(searchQuery);
  };

  const handleEditClick = (user) => {
    setEditingUser(user);
    setEditForm({
      name: user.name,
      email: user.email,
      department: user.department || "Engineering",
      jobTitle: user.jobTitle || ""
    });
  };

  const handleSaveEdit = async (e) => {
    e.preventDefault();
    const targetId = editingUser._id || editingUser.id;
    try {
      setLoading(true);
      const res = await api.put(`/admin/users/${targetId}`, editForm);
      if (res.data.success) {
        showNotification("User profile details adjusted in database.");
        setUsersList(prev => prev.map(u => (u._id === targetId || u.id === targetId) ? res.data.user : u));
        setEditingUser(null);
      }
    } catch (err) {
      console.error(err);
      showNotification(err.response?.data?.message || "Failed to update user profile.");
    } finally {
      setLoading(false);
    }
  };

  const handleCreateUser = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const tempPassword = "Password123!";
      const res = await api.post("/admin/users", { ...editForm, password: tempPassword });
      if (res.data.success) {
        showNotification(`Registered new user account in database! Temp password is: ${tempPassword}`);
        setUsersList(prev => [res.data.user, ...prev]);
        setEditingUser(null);
      }
    } catch (err) {
      console.error(err);
      showNotification(err.response?.data?.message || "Failed to register new account.");
    } finally {
      setLoading(false);
    }
  };

  const handleToggleBlock = async (userId) => {
    const user = usersList.find(u => u._id === userId || u.id === userId);
    if (!user) return;
    const newStatus = user.status === "Active" ? "Banned" : "Active";
    try {
      const res = await api.put(`/admin/users/${userId}`, { status: newStatus });
      if (res.data.success) {
        showNotification(`User status toggled to ${newStatus}.`);
        setUsersList(prev => prev.map(u => (u._id === userId || u.id === userId) ? { ...u, status: newStatus } : u));
      }
    } catch (err) {
      console.error(err);
      showNotification(err.response?.data?.message || "Failed to toggle user status.");
    }
  };

  const handleDeleteTrigger = (user) => {
    setDeleteTarget(user);
  };

  const handleConfirmDelete = async () => {
    const targetId = deleteTarget._id || deleteTarget.id;
    try {
      const res = await api.delete(`/admin/users/${targetId}`);
      if (res.data.success) {
        showNotification("User account permanently deleted from MongoDB.");
        setUsersList(prev => prev.filter(u => (u._id !== targetId && u.id !== targetId)));
      }
    } catch (err) {
      console.error(err);
      showNotification(err.response?.data?.message || "Failed to delete user account.");
    } finally {
      setDeleteTarget(null);
    }
  };

  const handleChangeRole = async (userId, newRole) => {
    try {
      const res = await api.put(`/admin/users/${userId}/role`, { role: newRole.toLowerCase() });
      if (res.data.success) {
        showNotification(`User role modified to ${newRole} in database.`);
        setUsersList(prev => prev.map(u => (u._id === userId || u.id === userId) ? { ...u, role: newRole.toLowerCase() } : u));
      }
    } catch (err) {
      console.error(err);
      showNotification(err.response?.data?.message || "Failed to update role.");
    }
  };

  // Map values to display standard format
  const mappedUsers = usersList.map(u => ({
    id: u._id || u.id,
    _id: u._id || u.id,
    name: u.name,
    email: u.email,
    role: u.role === "admin" ? "Admin" : "User",
    department: u.department || "Engineering",
    jobTitle: u.jobTitle || "Developer",
    status: u.status || "Active"
  }));

  return (
    <div className="space-y-6">
      
      {/* Alert toast Banner */}
      {notification && (
        <div className="fixed top-5 right-5 z-50 bg-slate-950 border border-violet-500/40 text-white text-xs font-semibold py-3 px-5 rounded-2xl shadow-2xl flex items-center gap-2 animate-in slide-in-from-top duration-300">
          <span>{notification}</span>
        </div>
      )}

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <form onSubmit={handleSearchSubmit} className="relative w-full max-w-sm">
          <input
            type="text"
            placeholder="Search users and hit Enter..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-slate-955 bg-slate-950/60 border border-slate-800 rounded-xl py-2.5 pl-9 pr-4 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-violet-500 transition-colors"
          />
          <Search size={14} className="absolute left-3.5 top-3.5 text-slate-500" />
        </form>

        <button 
          onClick={() => handleEditClick({ id: Date.now().toString(), name: "", email: "", department: "", jobTitle: "", role: "User", status: "Active" })}
          className="flex items-center gap-2 bg-violet-650 bg-violet-600 hover:bg-violet-500 text-white font-bold text-xs px-4 py-2.5 rounded-xl transition shadow-md shadow-violet-500/10 cursor-pointer self-start sm:self-center"
        >
          <Plus size={14} />
          Register New Account
        </button>
      </div>

      {/* Main Table view */}
      {loading ? (
        <div className="p-12 flex flex-col items-center justify-center text-slate-400 text-xs gap-3 bg-slate-950/20 border border-slate-800 rounded-2xl">
          <div className="w-8 h-8 rounded-full border-2 border-slate-850 border-t-violet-600 animate-spin" />
          <span>Synchronizing users database...</span>
        </div>
      ) : (
        <UserTable 
          users={mappedUsers}
          onEdit={handleEditClick}
          onToggleBlock={handleToggleBlock}
          onDelete={handleDeleteTrigger}
          onChangeRole={handleChangeRole}
        />
      )}

      {/* Generic Delete Modal Confirm */}
      <DeleteModal 
        isOpen={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleConfirmDelete}
        title="Delete User Account?"
        message={deleteTarget ? `Are you sure you want to permanently delete user "${deleteTarget.name}"? This action will sever all team invites and cannot be undone.` : ''}
      />

      {/* Edit/Create overlay Modal */}
      {editingUser && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 px-4 animate-in fade-in duration-200">
          <form 
            onSubmit={(e) => {
              e.preventDefault();
              if (usersList.some(u => (u._id === editingUser._id || u.id === editingUser.id))) {
                handleSaveEdit(e);
              } else {
                handleCreateUser(e);
              }
            }} 
            className="bg-slate-950 border border-slate-800 rounded-2xl w-full max-w-sm shadow-2xl p-6 relative text-slate-100 animate-in zoom-in-95 duration-200 space-y-4"
          >
            <h3 className="text-sm font-bold text-white mb-2">
              {usersList.some(u => (u._id === editingUser._id || u.id === editingUser.id)) ? "Edit User Details" : "Register User Account"}
            </h3>
            
            <div className="space-y-3.5 text-xs">
              <div>
                <label className="block text-slate-400 font-bold mb-1.5">User Full Name</label>
                <input 
                  type="text" 
                  value={editForm.name}
                  onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                  required
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3.5 py-2.5 text-white placeholder-slate-600 focus:outline-none focus:border-violet-500"
                />
              </div>
              <div>
                <label className="block text-slate-400 font-bold mb-1.5">Email Address</label>
                <input 
                  type="email" 
                  value={editForm.email}
                  onChange={(e) => setEditForm({ ...editForm, email: e.target.value })}
                  required
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3.5 py-2.5 text-white placeholder-slate-600 focus:outline-none focus:border-violet-500"
                />
              </div>
              <div>
                <label className="block text-slate-400 font-bold mb-1.5">Department</label>
                <input 
                  type="text" 
                  value={editForm.department}
                  onChange={(e) => setEditForm({ ...editForm, department: e.target.value })}
                  required
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3.5 py-2.5 text-white placeholder-slate-600 focus:outline-none focus:border-violet-500"
                />
              </div>
              <div>
                <label className="block text-slate-400 font-bold mb-1.5">Job Title</label>
                <input 
                  type="text" 
                  value={editForm.jobTitle}
                  onChange={(e) => setEditForm({ ...editForm, jobTitle: e.target.value })}
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3.5 py-2.5 text-white placeholder-slate-600 focus:outline-none focus:border-violet-500"
                />
              </div>
            </div>

            <div className="flex justify-end gap-3 text-xs pt-2">
              <button
                type="button"
                onClick={() => setEditingUser(null)}
                className="flex-1 py-2.5 rounded-xl text-slate-350 bg-slate-900 border border-slate-800 hover:bg-slate-850 hover:text-white transition font-bold"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="flex-1 py-2.5 rounded-xl text-white bg-violet-650 bg-violet-600 hover:bg-violet-500 transition font-bold shadow-sm shadow-violet-500/10"
              >
                Save Account
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

export default Users;
