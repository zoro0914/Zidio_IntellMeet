import React, { useState, useEffect } from 'react';
import MeetingTable from '../components/Admin/MeetingTable';
import DeleteModal from '../components/Admin/DeleteModal';
import api from '../Utils/api';
import { Search, Plus, Eye, X, Calendar, User, Mail, Link, AlertTriangle } from 'lucide-react';

const Meetings = () => {
  const [meetingsList, setMeetingsList] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [notification, setNotification] = useState("");

  // Modal states
  const [detailsTarget, setDetailsTarget] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [cancelTarget, setCancelTarget] = useState(null);
  const [scheduleModalOpen, setScheduleModalOpen] = useState(false);

  // New meeting form states
  const [form, setForm] = useState({
    title: "",
    description: "",
    meetingDate: "",
    meetingLink: "",
    inviteEmails: ""
  });

  const showNotification = (msg) => {
    setNotification(msg);
    setTimeout(() => setNotification(""), 5000);
  };

  const fetchMeetings = async () => {
    try {
      setLoading(true);
      const res = await api.get("/meetings");
      if (res.data.success) {
        setMeetingsList(res.data.meetings);
      }
    } catch (error) {
      console.error("Failed to load meetings:", error);
      showNotification("Failed to connect to database. Showing local offline data.");
      // Fallback mock data
      setMeetingsList([
        { id: "1", _id: "1", title: "Product Sync & Design Huddle", meetingDate: new Date().toISOString(), createdBy: { name: "Harsh kumar", email: "hs0037118@gmail.com" }, participants: [1,2,3,4], status: "scheduled", meetingLink: "prd-dsgn-hdl" },
        { id: "2", _id: "2", title: "Zidio Marketing Alignment", meetingDate: new Date(Date.now() - 86400000).toISOString(), createdBy: { name: "Sania Malhotra", email: "sania.m@zidio.co" }, participants: [1,2], status: "completed", meetingLink: "zd-mrkt-align" }
      ]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMeetings();
  }, []);

  const generateRandomCode = () => {
    const chars = "abcdefghijklmnopqrstuvwxyz";
    const part = () => Array.from({ length: 3 }, () => chars[Math.floor(Math.random() * chars.length)]).join("");
    const generated = `${part()}-${part()}-${part()}`;
    const frontendBaseUrl = window.location.origin.replace("5173", "5173"); // typical Vite dev port
    setForm(prev => ({ ...prev, meetingLink: `${frontendBaseUrl}/meeting/${generated}` }));
  };

  const handleOpenScheduleModal = () => {
    setForm({
      title: "",
      description: "",
      meetingDate: "",
      meetingLink: "",
      inviteEmails: ""
    });
    setScheduleModalOpen(true);
    // Auto-generate link on open
    setTimeout(generateRandomCode, 50);
  };

  const handleScheduleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Split invite emails by comma
      const emailsArray = form.inviteEmails
        .split(",")
        .map(email => email.trim())
        .filter(email => email.includes("@"));

      const res = await api.post("/meetings", {
        title: form.title,
        description: form.description,
        meetingDate: form.meetingDate,
        meetingLink: form.meetingLink,
        inviteEmails: emailsArray
      });

      if (res.data.success) {
        showNotification("Meeting scheduled successfully! Email notifications dispatched.");
        setScheduleModalOpen(false);
        fetchMeetings();
      }
    } catch (error) {
      console.error("Failed to schedule meeting:", error);
      showNotification(error.response?.data?.message || "Failed to save meeting record.");
    }
  };

  const handleConfirmCancel = async () => {
    try {
      const res = await api.put(`/meetings/${cancelTarget._id}/cancel`);
      if (res.data.success) {
        showNotification("Meeting session cancelled successfully.");
        setCancelTarget(null);
        fetchMeetings();
      }
    } catch (error) {
      console.error(error);
      showNotification("Failed to cancel meeting.");
      setCancelTarget(null);
    }
  };

  const handleConfirmDelete = async () => {
    try {
      const res = await api.delete(`/meetings/${deleteTarget._id}`);
      if (res.data.success) {
        showNotification("Meeting record permanently deleted.");
        setDeleteTarget(null);
        fetchMeetings();
      }
    } catch (error) {
      console.error(error);
      showNotification("Failed to delete meeting.");
      setDeleteTarget(null);
    }
  };

  // Convert schema object to view formats
  const mappedMeetings = meetingsList.map(m => ({
    id: m._id || m.id,
    _id: m._id || m.id,
    title: m.title,
    date: m.meetingDate,
    createdAt: m.meetingDate,
    hostName: m.createdBy?.name || "Unknown",
    hostEmail: m.createdBy?.email || "",
    participantsCount: m.participants?.length || 1,
    duration: m.duration || "00:45:00",
    meetingLink: m.meetingLink,
    description: m.description,
    status: m.status === "scheduled" ? "Upcoming" : m.status === "cancelled" ? "Cancelled" : "Completed"
  }));

  const filteredMeetings = mappedMeetings.filter(m => 
    m.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    m.hostName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleViewDetails = (meeting) => {
    setDetailsTarget(meeting);
  };

  const handleDeleteTrigger = (meeting) => {
    setDeleteTarget(meeting);
  };

  return (
    <div className="space-y-6">
      
      {/* Alert toast Banner */}
      {notification && (
        <div className="fixed top-5 right-5 z-50 bg-slate-950 border border-violet-500/40 text-white text-xs font-semibold py-3 px-5 rounded-2xl shadow-2xl flex items-center gap-2 animate-in slide-in-from-top duration-300">
          <span>{notification}</span>
        </div>
      )}

      {/* Toolbar row */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="relative w-full max-w-sm">
          <input
            type="text"
            placeholder="Search meetings by title or host..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-slate-950/60 border border-slate-800 rounded-xl py-2.5 pl-9 pr-4 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-violet-500 transition-colors"
          />
          <Search size={14} className="absolute left-3.5 top-3.5 text-slate-500" />
        </div>

        <button 
          onClick={handleOpenScheduleModal}
          className="flex items-center gap-2 bg-violet-650 bg-violet-600 hover:bg-violet-500 text-white font-bold text-xs px-4 py-2.5 rounded-xl transition shadow-md shadow-violet-500/10 cursor-pointer self-start sm:self-center"
        >
          <Plus size={14} />
          Schedule Conference
        </button>
      </div>

      {/* Grid list view */}
      {loading ? (
        <div className="p-12 flex flex-col items-center justify-center text-slate-400 text-xs gap-3 bg-slate-950/20 border border-slate-800 rounded-2xl">
          <div className="w-8 h-8 rounded-full border-2 border-slate-850 border-t-violet-600 animate-spin" />
          <span>Synchronizing meeting logs...</span>
        </div>
      ) : (
        <MeetingTable 
          meetings={filteredMeetings}
          onViewDetails={handleViewDetails}
          onCancel={(m) => setCancelTarget(m)}
          onDelete={handleDeleteTrigger}
        />
      )}

      {/* Details overlay Modal */}
      {detailsTarget && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 px-4 animate-in fade-in duration-200">
          <div className="bg-slate-950 border border-slate-800 rounded-2xl w-full max-w-md shadow-2xl p-6 relative text-slate-100 animate-in zoom-in-95 duration-200 space-y-4">
            <div className="flex justify-between items-center pb-2 border-b border-slate-800">
              <h3 className="text-sm font-bold text-white">Meeting Specifications</h3>
              <button onClick={() => setDetailsTarget(null)} className="text-slate-400 hover:text-white">
                <X size={16} />
              </button>
            </div>

            <div className="space-y-3.5 text-xs">
              <div className="grid grid-cols-3 gap-2">
                <span className="text-slate-500 font-bold">Title:</span>
                <span className="col-span-2 text-slate-200 font-bold">{detailsTarget.title}</span>
              </div>
              <div className="grid grid-cols-3 gap-2">
                <span className="text-slate-500 font-bold">Description:</span>
                <span className="col-span-2 text-slate-350">{detailsTarget.description || "No description provided."}</span>
              </div>
              <div className="grid grid-cols-3 gap-2">
                <span className="text-slate-500 font-bold">Host:</span>
                <span className="col-span-2 text-slate-200">{detailsTarget.hostName} ({detailsTarget.hostEmail})</span>
              </div>
              <div className="grid grid-cols-3 gap-2">
                <span className="text-slate-500 font-bold">Scheduled Time:</span>
                <span className="col-span-2 text-slate-200">{new Date(detailsTarget.date).toLocaleString()}</span>
              </div>
              <div className="grid grid-cols-3 gap-2">
                <span className="text-slate-500 font-bold">Session Link:</span>
                <a href={detailsTarget.meetingLink} target="_blank" rel="noopener noreferrer" className="col-span-2 text-violet-400 hover:underline truncate">
                  {detailsTarget.meetingLink}
                </a>
              </div>
              <div className="grid grid-cols-3 gap-2">
                <span className="text-slate-500 font-bold">Status:</span>
                <span className={`col-span-2 font-bold ${
                  detailsTarget.status === 'Upcoming' 
                    ? 'text-emerald-400' 
                    : detailsTarget.status === 'Cancelled' 
                      ? 'text-red-400' 
                      : 'text-slate-400'
                }`}>
                  {detailsTarget.status}
                </span>
              </div>
            </div>

            <div className="flex gap-3 pt-2 text-xs">
              {detailsTarget.status === 'Upcoming' && (
                <button
                  onClick={() => {
                    setCancelTarget(detailsTarget);
                    setDetailsTarget(null);
                  }}
                  className="flex-1 py-2.5 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-400 hover:bg-amber-500/20 transition font-bold"
                >
                  Cancel Session
                </button>
              )}
              <button 
                onClick={() => setDetailsTarget(null)}
                className="flex-1 py-2.5 rounded-xl text-slate-200 bg-slate-900 border border-slate-800 hover:bg-slate-850 hover:text-white transition font-bold"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Schedule meeting Modal */}
      {scheduleModalOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 px-4 animate-in fade-in duration-200">
          <form 
            onSubmit={handleScheduleSubmit} 
            className="bg-slate-950 border border-slate-800 rounded-2xl w-full max-w-md shadow-2xl p-6 relative text-slate-100 animate-in zoom-in-95 duration-200 space-y-4"
          >
            <div className="flex justify-between items-center pb-2 border-b border-slate-800">
              <h3 className="text-sm font-bold text-white">Schedule New Conference</h3>
              <button type="button" onClick={() => setScheduleModalOpen(false)} className="text-slate-400 hover:text-white">
                <X size={16} />
              </button>
            </div>

            <div className="space-y-3.5 text-xs">
              <div>
                <label className="block text-slate-400 font-bold mb-1.5 flex items-center gap-1"><User size={12}/> Meeting Title</label>
                <input 
                  type="text" 
                  value={form.title}
                  onChange={(e) => setForm({ ...form, title: e.target.value })}
                  placeholder="e.g. Weekly Marketing Align"
                  required
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3.5 py-2.5 text-white placeholder-slate-650 focus:outline-none focus:border-violet-500"
                />
              </div>

              <div>
                <label className="block text-slate-400 font-bold mb-1.5">Description (optional)</label>
                <textarea 
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  placeholder="Details or agenda items..."
                  rows={2}
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3.5 py-2.5 text-white placeholder-slate-650 focus:outline-none focus:border-violet-500 resize-none"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div>
                  <label className="block text-slate-400 font-bold mb-1.5 flex items-center gap-1"><Calendar size={12}/> Date & Time</label>
                  <input 
                    type="datetime-local" 
                    value={form.meetingDate}
                    onChange={(e) => setForm({ ...form, meetingDate: e.target.value })}
                    required
                    className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3.5 py-2.5 text-white focus:outline-none focus:border-violet-500"
                  />
                </div>
                <div>
                  <label className="block text-slate-400 font-bold mb-1.5 flex items-center justify-between gap-1">
                    <span className="flex items-center gap-1"><Link size={12}/> Room Link</span>
                    <button type="button" onClick={generateRandomCode} className="text-[10px] text-violet-400 hover:text-violet-300 font-bold">Regen</button>
                  </label>
                  <input 
                    type="text" 
                    value={form.meetingLink}
                    onChange={(e) => setForm({ ...form, meetingLink: e.target.value })}
                    required
                    className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3.5 py-2.5 text-white focus:outline-none focus:border-violet-500 font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-400 font-bold mb-1.5 flex items-center gap-1"><Mail size={12}/> Invite Participants (emails)</label>
                <input 
                  type="text" 
                  value={form.inviteEmails}
                  onChange={(e) => setForm({ ...form, inviteEmails: e.target.value })}
                  placeholder="comma separated: user1@zidio.co, user2@zidio.co"
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3.5 py-2.5 text-white placeholder-slate-650 focus:outline-none focus:border-violet-500"
                />
                <span className="text-[9px] text-slate-500 mt-1 block">Recipients will receive full HTML email invitations containing coordinates.</span>
              </div>
            </div>

            <div className="flex justify-end gap-3 text-xs pt-2">
              <button
                type="button"
                onClick={() => setScheduleModalOpen(false)}
                className="flex-1 py-2.5 rounded-xl text-slate-350 bg-slate-900 border border-slate-800 hover:bg-slate-850 hover:text-white transition font-bold"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="flex-1 py-2.5 rounded-xl text-white bg-violet-650 bg-violet-600 hover:bg-violet-500 transition font-bold shadow-md shadow-violet-500/10 cursor-pointer"
              >
                Schedule & Email
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Cancel Modal Confirm */}
      <DeleteModal 
        isOpen={!!cancelTarget}
        onClose={() => setCancelTarget(null)}
        onConfirm={handleConfirmCancel}
        title="Cancel Scheduled Meeting?"
        message={cancelTarget ? `Are you sure you want to cancel the scheduled meeting "${cancelTarget.title}"? Invitees will see the cancelled tag.` : ''}
      />

      {/* Delete Modal Confirm */}
      <DeleteModal 
        isOpen={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleConfirmDelete}
        title="Delete Meeting Log?"
        message={deleteTarget ? `Are you sure you want to permanently delete the meeting records for "${deleteTarget.title}"? This cannot be undone.` : ''}
      />
    </div>
  );
};

export default Meetings;
