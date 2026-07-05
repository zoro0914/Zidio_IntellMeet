import { useState, useEffect } from "react";
import DashboardLayout from "../layouts/DashboardLayout";
import api from "../Utils/api";

// Reusable Notes components
import ContextSelector from "../components/Notes/ContextSelector";
import NoteCard from "../components/Notes/NoteCard";
import NoteFormModal from "../components/Notes/NoteFormModal";

import {
  FileText,
  Plus,
  Loader,
  Brain,
  CheckCircle,
} from "lucide-react";

const Notes = () => {
  const [meetings, setMeetings] = useState([]);
  const [selectedMeetingId, setSelectedMeetingId] = useState("");

  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [aiGenerating, setAiGenerating] = useState(false);

  // Edit / Create Modals toggles
  const [modalOpen, setModalOpen] = useState(false);
  const [editingNote, setEditingNote] = useState(null);
  const [formData, setFormData] = useState({ title: "", body: "" });

  const [notification, setNotification] = useState("");

  const showNotification = (msg) => {
    setNotification(msg);
    setTimeout(() => setNotification(""), 3000);
  };

  // Custom confirm popup dialog state
  const [confirmDialog, setConfirmDialog] = useState({
    isOpen: false,
    title: "",
    message: "",
    onConfirm: null,
  });

  const triggerConfirm = (title, message, onConfirm) => {
    setConfirmDialog({
      isOpen: true,
      title,
      message,
      onConfirm,
    });
  };

  // Fetch completed/all meetings for context dropdown
  const fetchMeetings = async () => {
    try {
      const token = localStorage.getItem("accessToken");
      const res = await api.get("/meetings", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (res.data.success) {
        const meetingsList = res.data.meetings || [];
        setMeetings(meetingsList);
        if (meetingsList.length > 0) {
          setSelectedMeetingId(meetingsList[0]._id || meetingsList[0].id);
        }
      }
    } catch (err) {
      console.error("Error fetching meetings:", err);
    }
  };

  // Fetch notes based on selected meeting context filter
  const fetchNotes = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("accessToken");
      let url = "/notes";
      if (selectedMeetingId) {
        url += `?meetingId=${selectedMeetingId}`;
      }

      const res = await api.get(url, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (res.data.success) {
        setNotes(res.data.notes || []);
      }
    } catch (err) {
      console.error("Error fetching notes:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMeetings();
  }, []);

  useEffect(() => {
    fetchNotes();
  }, [selectedMeetingId]);

  // Create or Update Note API submission
  const handleFormSubmit = async (e) => {
    e.preventDefault();
    if (!formData.title.trim() || !formData.body.trim()) return;
    if (!selectedMeetingId) {
      showNotification("Error: Please select a meeting context first!");
      return;
    }

    try {
      const token = localStorage.getItem("accessToken");
      if (editingNote) {
        // Update Note
        const res = await api.put(
          `/notes/${editingNote._id}`,
          { title: formData.title, body: formData.body },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        if (res.data.success) {
          showNotification("Note updated successfully!");
          fetchNotes();
          closeModal();
        }
      } else {
        // Create Note
        const res = await api.post(
          "/notes",
          {
            title: formData.title,
            body: formData.body,
            meetingId: selectedMeetingId,
          },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        if (res.data.success) {
          showNotification("Manual note created successfully!");
          fetchNotes();
          closeModal();
        }
      }
    } catch (err) {
      console.error("Error saving note:", err);
      showNotification("Error: Failed to save note.");
    }
  };

  // Call Gemini to generate dynamic formatted AI study note from transcript context
  const handleGenerateAINote = async () => {
    if (!selectedMeetingId) {
      showNotification("Kripya context dropdown mein pehle kisi meeting ko select karein!");
      return;
    }

    try {
      setAiGenerating(true);
      showNotification("Gemini is reading meeting logs to draft study notes...");
      const token = localStorage.getItem("accessToken");
      const res = await api.post(
        `/notes/generate/${selectedMeetingId}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (res.data.success) {
        showNotification("AI Note generated successfully!");
        fetchNotes();
      }
    } catch (err) {
      console.error("Gemini AI notes generation failed:", err);
      showNotification("AI notes failed. Verify transcription logs exist.");
    } finally {
      setAiGenerating(false);
    }
  };

  // Delete Note permanently
  const handleDeleteNote = async (id) => {
    triggerConfirm(
      "Permanently Delete",
      "Are you sure you want to permanently delete this note?",
      async () => {
        try {
          const token = localStorage.getItem("accessToken");
          const res = await api.delete(`/notes/${id}`, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });
          if (res.data.success) {
            showNotification("Note deleted successfully.");
            fetchNotes();
          }
        } catch (err) {
          console.error("Error deleting note:", err);
          showNotification("Error: Failed to delete note.");
        }
      }
    );
  };

  // Download Note text dynamically as markdown file (.md)
  const handleDownloadNote = (note) => {
    const text = `# ${note.title}\n\nLast Updated: ${new Date(note.updatedAt).toLocaleString()}\n\n${note.body}`;
    const blob = new Blob([text], { type: "text/markdown;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", `${note.title.replace(/[^a-zA-Z0-9]/g, "_")}.md`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    showNotification("Note downloaded successfully!");
  };

  const openCreateModal = () => {
    setEditingNote(null);
    setFormData({ title: "", body: "" });
    setModalOpen(true);
  };

  const openEditModal = (note) => {
    setEditingNote(note);
    setFormData({ title: note.title, body: note.body });
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setEditingNote(null);
    setFormData({ title: "", body: "" });
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">

        {/* Banner Alert Toast */}
        {notification && (
          <div className="fixed bottom-5 right-5 bg-slate-900 text-white rounded-xl px-5 py-3.5 shadow-2xl flex items-center gap-3 z-50 animate-bounce">
            <CheckCircle className="text-emerald-400" size={20} />
            <span className="text-sm font-semibold">{notification}</span>
          </div>
        )}

        {/* Header Block with Actions */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
          <div>
            <h1 className="text-3xl font-bold text-slate-905">Meeting Notes</h1>
            <p className="text-slate-500 mt-1">Review manual summaries and launch AI-extracted study logs.</p>
          </div>

          <div className="flex flex-wrap gap-3">
            {selectedMeetingId && (
              <button
                onClick={handleGenerateAINote}
                disabled={aiGenerating}
                className={`font-bold text-sm rounded-xl px-5 py-3 shadow-md flex items-center gap-2 transition ${aiGenerating
                  ? "bg-violet-400 text-white cursor-wait opacity-80"
                  : "bg-gradient-to-r from-violet-600 to-violet-500 hover:from-violet-700 hover:to-indigo-750 text-white cursor-pointer"
                  }`}
              >
                {aiGenerating ? (
                  <>
                    <Loader className="animate-spin text-white" size={16} />
                    <span>AI Drafting Note...</span>
                  </>
                ) : (
                  <>
                    <Brain className="text-amber-300" size={16} />
                    <span>Generate AI Note</span>
                  </>
                )}
              </button>
            )}

            <button
              onClick={openCreateModal}
              disabled={!selectedMeetingId}
              className={`font-bold text-sm rounded-xl px-5 py-3 shadow-md flex items-center gap-2 transition ${selectedMeetingId
                ? "bg-slate-900 hover:bg-slate-800 text-white cursor-pointer"
                : "bg-slate-100 text-slate-400 cursor-not-allowed"
                }`}
            >
              <Plus size={16} />
              <span>Create Note</span>
            </button>
          </div>
        </div>

        {/* Meeting selection context filters */}
        <ContextSelector
          selectedMeetingId={selectedMeetingId}
          setSelectedMeetingId={setSelectedMeetingId}
          meetings={meetings}
        />

        {/* Listings display grid */}
        {loading ? (
          <div className="py-24 text-center">
            <Loader className="mx-auto animate-spin text-violet-605 mb-4" size={40} />
            <p className="text-slate-500 font-semibold">Synchronizing call logs notes...</p>
          </div>
        ) : !selectedMeetingId ? (
          <div className="bg-slate-50 border rounded-2xl p-16 text-center text-slate-500 text-sm font-semibold">
            💡 Select a meeting context first.
          </div>
        ) : notes.length === 0 ? (
          <div className="bg-white border border-gray-200 rounded-2xl p-16 text-center shadow-sm">
            <FileText className="mx-auto text-slate-300 mb-4" size={56} />
            <h3 className="text-lg font-bold text-slate-700">No notes found for this meeting</h3>
            <p className="text-slate-455 text-xs mt-1 leading-relaxed">
              Create a manual note or click "Generate AI Note" to automatically summarize this meeting's transcript using Gemini!
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {notes.map((note) => (
              <NoteCard
                key={note._id}
                note={note}
                onEdit={openEditModal}
                onDelete={handleDeleteNote}
                onDownload={handleDownloadNote}
              />
            ))}
          </div>
        )}

      </div>

      {/* Composition overlay modal form */}
      <NoteFormModal
        isOpen={modalOpen}
        editingNote={editingNote}
        formData={formData}
        setFormData={setFormData}
        onClose={closeModal}
        onSubmit={handleFormSubmit}
      />

      {/* Custom Confirmation Dialog Popup */}
      {confirmDialog.isOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-[100] px-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl w-full max-w-sm shadow-2xl p-6 relative border border-slate-100 text-slate-900 animate-in zoom-in-95 duration-200">
            <h3 className="text-xl font-bold text-slate-800 mb-2">{confirmDialog.title}</h3>
            <p className="text-sm text-slate-550 mb-6 font-semibold">{confirmDialog.message}</p>

            <div className="flex justify-end gap-3">
              <button
                onClick={() => setConfirmDialog(prev => ({ ...prev, isOpen: false }))}
                className="px-5 py-2.5 rounded-xl text-slate-700 bg-gray-100 hover:bg-gray-200 transition text-sm font-semibold cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  setConfirmDialog(prev => ({ ...prev, isOpen: false }));
                  if (confirmDialog.onConfirm) confirmDialog.onConfirm();
                }}
                className="px-5 py-2.5 rounded-xl text-white bg-red-600 hover:bg-red-700 shadow-sm transition text-sm font-semibold cursor-pointer"
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}

    </DashboardLayout>
  );
};

export default Notes;
