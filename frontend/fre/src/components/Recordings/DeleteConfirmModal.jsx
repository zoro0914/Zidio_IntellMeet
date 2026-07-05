import React from "react";
import { AlertTriangle } from "lucide-react";

const DeleteConfirmModal = ({ isOpen, onClose, onConfirm }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-slate-900/60 z-50 flex items-center justify-center p-4 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white border rounded-2xl max-w-sm w-full p-6 shadow-2xl animate-in zoom-in-95 duration-200">
        <div className="w-12 h-12 rounded-xl bg-red-50 text-red-500 flex items-center justify-center mb-4">
          <AlertTriangle size={24} />
        </div>
        <h3 className="text-lg font-bold text-slate-900">Delete Recording?</h3>
        <p className="text-slate-500 text-sm mt-2 leading-relaxed">
          Are you sure you want to permanently delete this meeting recording? This action cannot be undone.
        </p>
        <div className="flex gap-3 mt-6">
          <button
            onClick={onClose}
            className="flex-1 border rounded-xl py-2.5 font-semibold text-slate-600 hover:bg-slate-50 transition animate-pulse"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="flex-1 bg-red-600 hover:bg-red-700 text-white rounded-xl py-2.5 font-semibold transition shadow-sm cursor-pointer"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeleteConfirmModal;
