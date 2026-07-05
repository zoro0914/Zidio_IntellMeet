import React from 'react';
import { AlertTriangle } from 'lucide-react';

const DeleteModal = ({ isOpen, onClose, onConfirm, title, message }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 px-4 animate-in fade-in duration-200">
      <div className="bg-slate-950 border border-slate-800 rounded-2xl w-full max-w-sm shadow-2xl p-6 relative text-slate-100 animate-in zoom-in-95 duration-200">
        <div className="w-12 h-12 rounded-xl bg-red-500/10 border border-red-500/30 text-red-500 flex items-center justify-center mb-4">
          <AlertTriangle size={24} />
        </div>
        
        <h3 className="text-base font-bold text-white mb-1.5">
          {title || "Confirm Removal?"}
        </h3>
        
        <p className="text-xs text-slate-400 mb-6 leading-relaxed">
          {message || "Are you sure you want to delete this resource? This action is permanent and cannot be undone."}
        </p>
        
        <div className="flex justify-end gap-3 text-xs">
          <button
            onClick={onClose}
            className="flex-1 py-2.5 rounded-xl text-slate-350 bg-slate-900 border border-slate-800 hover:bg-slate-850 hover:text-white transition font-bold cursor-pointer"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="flex-1 py-2.5 rounded-xl text-white bg-red-650 bg-red-600 hover:bg-red-500 transition font-bold cursor-pointer shadow-sm shadow-red-500/10"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeleteModal;
