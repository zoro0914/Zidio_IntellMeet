import React, { useState, useEffect } from 'react';
import api from '../Utils/api';
import NoteGrid from '../components/Admin/Notes/NoteGrid';
import CreateNoteModal from '../components/Admin/Notes/CreateNoteModal';
import NoteDetailsModal from '../components/Admin/Notes/NoteDetailsModal';
import DeleteModal from '../components/Admin/DeleteModal';
import { Search, Plus } from 'lucide-react';

const Notes = () => {
  const [notesList, setNotesList] = useState([]);
  const [meetingsList, setMeetingsList] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [notification, setNotification] = useState('');

  // Modals state
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [viewTarget, setViewTarget] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);

  const showNotification = (msg) => {
    setNotification(msg);
    setTimeout(() => setNotification(''), 4500);
  };

  const fetchNotes = async () => {
    try {
      setLoading(true);
      const res = await api.get('/notes');
      if (res.data.success) {
        setNotesList(res.data.notes);
      }
    } catch (err) {
      console.error(err);
      showNotification('Failed to fetch discussion notes.');
    } finally {
      setLoading(false);
    }
  };

  const fetchMeetings = async () => {
    try {
      const res = await api.get('/meetings');
      if (res.data.success) {
        setMeetingsList(res.data.meetings);
      }
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchNotes();
    fetchMeetings();
  }, []);

  const handleCreateNote = async (noteData) => {
    try {
      const res = await api.post('/notes', noteData);
      if (res.data.success) {
        showNotification('Discussion note uploaded successfully.');
        setIsCreateOpen(false);
        fetchNotes();
      }
    } catch (err) {
      console.error(err);
      showNotification(err.response?.data?.message || 'Failed to upload note.');
    }
  };

  const handleConfirmDelete = async () => {
    try {
      const res = await api.delete(`/notes/${deleteTarget._id}`);
      if (res.data.success) {
        showNotification('Discussion note permanently deleted.');
        fetchNotes();
      }
    } catch (err) {
      console.error(err);
      showNotification('Failed to delete discussion note.');
    } finally {
      setDeleteTarget(null);
    }
  };

  const filteredNotes = notesList.filter((note) => {
    const searchLower = searchQuery.toLowerCase();
    const matchesTitle = note.title.toLowerCase().includes(searchLower);
    const matchesBody = note.body.toLowerCase().includes(searchLower);
    const matchesMeeting = note.meetingId?.title?.toLowerCase().includes(searchLower);
    return matchesTitle || matchesBody || matchesMeeting;
  });

  return (
    <div className="space-y-6 text-slate-100">
      {/* Toast Alert Banner */}
      {notification && (
        <div className="fixed top-5 right-5 z-50 bg-[#070B24] border border-violet-500/40 text-white text-xs font-semibold py-3 px-5 rounded-2xl shadow-2xl flex items-center gap-2 animate-in slide-in-from-top duration-300">
          <span>{notification}</span>
        </div>
      )}

      {/* Toolbar Controls Row */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="relative w-full max-w-sm">
          <input
            type="text"
            placeholder="Search discussion notes..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-slate-950/60 border border-slate-800 rounded-xl py-2.5 pl-9 pr-4 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-violet-500 transition-colors"
          />
          <Search size={14} className="absolute left-3.5 top-3.5 text-slate-500" />
        </div>

        <button
          onClick={() => setIsCreateOpen(true)}
          className="flex items-center gap-2 bg-violet-650 bg-violet-600 hover:bg-violet-505 hover:bg-violet-500 text-white font-bold text-xs px-4 py-2.5 rounded-xl transition shadow-md shadow-violet-500/10 cursor-pointer self-start sm:self-center"
        >
          <Plus size={14} />
          Upload Note
        </button>
      </div>

      {/* Grid Display View */}
      {loading ? (
        <div className="p-12 flex flex-col items-center justify-center text-slate-405 text-slate-400 text-xs gap-3 bg-slate-955 bg-slate-950/20 border border-slate-850 border-slate-800 rounded-2xl">
          <div className="w-8 h-8 rounded-full border-2 border-slate-850 border-t-violet-600 animate-spin" />
          <span>Synchronizing discussion notes registry...</span>
        </div>
      ) : (
        <NoteGrid
          notes={filteredNotes}
          onViewDetails={(note) => setViewTarget(note)}
          onDelete={(note) => setDeleteTarget(note)}
        />
      )}

      {/* Action Modals */}
      <CreateNoteModal
        isOpen={isCreateOpen}
        onClose={() => setIsCreateOpen(false)}
        onSubmit={handleCreateNote}
        meetings={meetingsList}
      />

      <NoteDetailsModal
        isOpen={!!viewTarget}
        onClose={() => setViewTarget(null)}
        note={viewTarget}
      />

      <DeleteModal
        isOpen={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleConfirmDelete}
        title="Delete Discussion Note?"
        message={deleteTarget ? `Are you sure you want to permanently delete note "${deleteTarget.title}"? This action cannot be undone.` : ''}
      />
    </div>
  );
};

export default Notes;
