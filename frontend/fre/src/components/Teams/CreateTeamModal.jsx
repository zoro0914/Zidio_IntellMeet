import { useState } from "react";
import { X, Loader } from "lucide-react";
import api from "../../Utils/api";

const CreateTeamModal = ({ isOpen, onClose, onTeamCreated }) => {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name.trim()) return;

    try {
      setLoading(true);
      setError("");

      const res = await api.post("/teams", {
        name: name.trim(),
        description: description.trim(),
      });

      if (res.data.success) {
        onTeamCreated(res.data.team);
        setName("");
        setDescription("");
        onClose();
      }
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || "Failed to create team. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 px-4 animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl relative border border-slate-100 text-slate-900 animate-in fade-in zoom-in-95 duration-200">
        <div className="flex justify-between items-center px-6 py-4 border-b border-gray-100 bg-gray-50/50 rounded-t-2xl">
          <h3 className="text-xl font-bold text-slate-800">Create New Team</h3>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {error && (
            <div className="p-3 text-sm text-red-650 bg-red-50 border border-red-200 rounded-xl">
              {error}
            </div>
          )}

          <div className="space-y-1.5">
            <label className="block text-sm font-semibold text-slate-700">Team Name *</label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Frontend Engineers"
              className="w-full bg-white border border-gray-200 text-slate-800 placeholder-gray-400 rounded-xl px-4 py-3 focus:outline-none focus:border-violet-500 transition-colors"
            />
          </div>

          <div className="space-y-1.5">
            <label className="block text-sm font-semibold text-slate-700">Description</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="What this team is about..."
              rows={3}
              className="w-full bg-white border border-gray-200 text-slate-800 placeholder-gray-400 rounded-xl px-4 py-3 focus:outline-none focus:border-violet-500 transition-colors resize-none"
            />
          </div>

          <div className="flex justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              disabled={loading}
              className="px-5 py-2.5 rounded-xl text-slate-700 bg-gray-100 hover:bg-gray-200 transition font-medium"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading || !name.trim()}
              className="px-5 py-2.5 rounded-xl text-white bg-gradient-to-l from-violet-600 to-violet-800 hover:opacity-95 shadow-sm transition flex items-center gap-2 font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading && <Loader size={16} className="animate-spin" />}
              {loading ? "Creating..." : "Create Team"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateTeamModal;
