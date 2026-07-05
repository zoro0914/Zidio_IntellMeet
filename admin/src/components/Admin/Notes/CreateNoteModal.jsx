import React, { useState, useEffect } from 'react';
import { X, FileText, Video } from 'lucide-react';

const CreateNoteModal = ({ isOpen, onClose, onSubmit, meetings }) => {
  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');
  const [meetingId, setMeetingId] = useState('');
  const [file, setFile] = useState(null);

  useEffect(() => {
    if (isOpen) {
      setTitle('');
      setBody('');
      setFile(null);
      // Set first meeting as default if list is available
      if (meetings && meetings.length > 0) {
        setMeetingId(meetings[0]._id || meetings[0].id || '');
      } else {
        setMeetingId('');
      }
    }
  }, [isOpen, meetings]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title.trim() || !meetingId) return;
    onSubmit({ title, body, meetingId, file });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 px-4 animate-in fade-in duration-200">
      <form 
        onSubmit={handleSubmit} 
        className="bg-slate-955 bg-slate-950 border border-slate-800 rounded-2xl w-full max-w-md shadow-2xl p-6 relative text-slate-100 animate-in zoom-in-95 duration-200 space-y-4"
      >
        <div className="flex justify-between items-center pb-2 border-b border-slate-800">
          <h3 className="text-sm font-bold text-white flex items-center gap-2">
            <FileText size={16} className="text-violet-500" />
            Upload Meeting Note
          </h3>
          <button type="button" onClick={onClose} className="text-slate-400 hover:text-white">
            <X size={16} />
          </button>
        </div>

        <div className="space-y-4 text-xs">
          <div>
            <label className="block text-slate-400 font-bold mb-1.5">Note Title</label>
            <input 
              type="text" 
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g., Marketing Campaign Alignments"
              required
              className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3.5 py-2.5 text-white placeholder-slate-650 focus:outline-none focus:border-violet-500"
            />
          </div>

          <div>
            <label className="block text-slate-400 font-bold mb-1.5 flex items-center gap-1">
              <Video size={12} className="text-slate-500" />
              Associate with Meeting
            </label>
            <select
              value={meetingId}
              onChange={(e) => setMeetingId(e.target.value)}
              required
              className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3.5 py-2.5 text-white focus:outline-none focus:border-violet-500 cursor-pointer"
            >
              {meetings && meetings.length > 0 ? (
                meetings.map(m => (
                  <option key={m._id || m.id} value={m._id || m.id}>
                    {m.title}
                  </option>
                ))
              ) : (
                <option value="" disabled>-- No meetings available --</option>
              )}
            </select>
          </div>

          <div>
            <label className="block text-slate-400 font-bold mb-1.5">Discussion Content (Optional)</label>
            <textarea 
              value={body}
              onChange={(e) => setBody(e.target.value)}
              placeholder="Enter discussion points, notes, decisions (optional)..."
              rows={4}
              className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3.5 py-2.5 text-white placeholder-slate-650 focus:outline-none focus:border-violet-500 resize-none leading-relaxed"
            />
          </div>

          <div>
            <label className="block text-slate-400 font-bold mb-1.5">Attachment File (PDF, Image, Doc, TXT)</label>
            <input 
              type="file" 
              onChange={(e) => setFile(e.target.files[0])}
              className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3.5 py-2 text-slate-350 text-xs focus:outline-none focus:border-violet-500 cursor-pointer"
            />
            {file && (
              <span className="text-[10px] text-violet-400 block mt-1">
                Selected: {file.name} ({(file.size / 1024).toFixed(1)} KB)
              </span>
            )}
          </div>
        </div>

        <div className="flex justify-end gap-3 text-xs pt-2">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 py-2.5 rounded-xl text-slate-350 bg-slate-900 border border-slate-800 hover:bg-slate-850 hover:text-white transition font-bold"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={!meetingId}
            className="flex-1 py-2.5 rounded-xl text-white bg-violet-650 bg-violet-600 hover:bg-violet-500 transition font-bold shadow-md shadow-violet-500/10 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Upload Note
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreateNoteModal;
