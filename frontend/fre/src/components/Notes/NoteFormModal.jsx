import React from "react";
import { X } from "lucide-react";

const NoteFormModal = ({ isOpen, editingNote, formData, setFormData, onClose, onSubmit }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 px-4">
      <div className="bg-white rounded-2xl w-full max-w-lg shadow-2xl p-6 relative border border-slate-100 text-slate-900 animate-in fade-in zoom-in-95 duration-200">

        <div className="flex items-center justify-between border-b pb-4 mb-4">
          <h3 className="text-xl font-bold">
            {editingNote ? "Edit Note" : "Compose Note"}
          </h3>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-50 rounded-xl"
          >
            <X size={18} />
          </button>
        </div>

        <form onSubmit={onSubmit} className="space-y-4">

          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">Note Title</label>
            <input
              type="text"
              placeholder="Study Agenda / Follow-up details"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="w-full px-3.5 py-2.5 border rounded-xl outline-none focus:ring-2 focus:ring-violet-500 text-sm font-semibold"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">Note Content</label>
            <textarea
              rows={6}
              placeholder="Type notes body text here..."
              value={formData.body}
              onChange={(e) => setFormData({ ...formData, body: e.target.value })}
              className="w-full px-3.5 py-2.5 border rounded-xl outline-none focus:ring-2 focus:ring-violet-500 text-sm font-semibold resize-none"
              required
            />
          </div>

          <div className="flex justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border rounded-xl text-slate-650 hover:bg-slate-50 text-xs font-semibold"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 bg-violet-500 hover:bg-violet-650 text-white rounded-xl text-xs font-semibold cursor-pointer shadow-sm"
            >
              Save Note
            </button>
          </div>

        </form>

      </div>
    </div>
  );
};

export default NoteFormModal;
