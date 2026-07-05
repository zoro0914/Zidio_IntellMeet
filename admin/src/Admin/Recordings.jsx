import React, { useState, useEffect } from 'react';
import RecordingTable from '../components/Admin/RecordingTable';
import DeleteModal from '../components/Admin/DeleteModal';
import api from '../Utils/api';
import { Search, PlayCircle, X, Upload, HardDrive, Cpu, Film, CheckCircle2 } from 'lucide-react';

const Recordings = () => {
  const [recordingsList, setRecordingsList] = useState([]);
  const [meetingsList, setMeetingsList] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  
  // Modal states
  const [playTarget, setPlayTarget] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [uploadModalOpen, setUploadModalOpen] = useState(false);

  // Upload progress states
  const [uploadFile, setUploadFile] = useState(null);
  const [associatedMeetingId, setAssociatedMeetingId] = useState("");
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);

  const [notification, setNotification] = useState("");

  const showNotification = (msg) => {
    setNotification(msg);
    setTimeout(() => setNotification(""), 4500);
  };

  const loadRecordingsData = async () => {
    // Fetch meetings to populate dropdown selector
    try {
      const res = await api.get("/meetings");
      if (res.data.success) {
        setMeetingsList(res.data.meetings);
        // Format meetings list to show as recordings
        const formatted = res.data.meetings.map(m => ({
          id: m._id,
          _id: m._id,
          title: m.title,
          duration: m.duration || "00:45:00",
          size: m.size ? `${m.size} MB` : "45 MB",
          aiStatus: m.summary ? "Processed" : "Pending",
          videoUrl: m.videoUrl || "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4"
        }));
        setRecordingsList(formatted);
      }
    } catch (e) {
      console.error(e);
      setMeetingsList([]);
      setRecordingsList([]);
    }
  };

  useEffect(() => {
    loadRecordingsData();
  }, []);

  const handlePlay = (rec) => {
    setPlayTarget(rec);
  };

  const handleDownload = (rec) => {
    showNotification(`Downloading media archive: ${rec.title} (${rec.size})`);
  };

  const handleDeleteTrigger = (rec) => {
    setDeleteTarget(rec);
  };

  const handleConfirmDelete = async () => {
    try {
      const targetId = deleteTarget._id || deleteTarget.id;
      const res = await api.delete(`/meetings/${targetId}`);
      if (res.data.success) {
        showNotification("Recording deleted successfully.");
        await loadRecordingsData();
      }
    } catch (err) {
      console.error(err);
      showNotification("Failed to delete recording.");
    } finally {
      setDeleteTarget(null);
    }
  };

  const handleFileChange = (e) => {
    if (e.target.files.length > 0) {
      const file = e.target.files[0];
      setUploadFile(file);
    }
  };

  const handleUploadSubmit = async (e) => {
    e.preventDefault();
    if (!uploadFile) return;

    setIsUploading(true);
    setUploadProgress(0);

    // Find meeting title if selected
    const matchedMeeting = meetingsList.find(m => m._id === associatedMeetingId);
    const finalTitle = matchedMeeting ? matchedMeeting.title : uploadFile.name.replace(/\.[^/.]+$/, "");
    
    // Format size in MB
    const calculatedSizeVal = parseFloat((uploadFile.size / (1024 * 1024)).toFixed(1));
    const calculatedSize = `${calculatedSizeVal} MB`;

    // Simulate progress bar glow
    const interval = setInterval(() => {
      setUploadProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          return 100;
        }
        return prev + 20;
      });
    }, 100);

    // Wait for the upload simulation and make real backend call
    setTimeout(async () => {
      try {
        if (associatedMeetingId) {
          // Update existing meeting recording assets
          await api.put(`/meetings/${associatedMeetingId}`, {
            videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4",
            size: calculatedSizeVal,
            duration: "00:25:00",
            status: "completed"
          });
        } else {
          // Create a new meeting log for this unassociated recording upload
          await api.post("/meetings", {
            title: finalTitle,
            description: "Manually uploaded conference record",
            meetingDate: new Date().toISOString(),
            meetingLink: "recorded-upload-" + Math.floor(1000 + Math.random() * 9000),
            videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4",
            size: calculatedSizeVal,
            duration: "00:25:00",
            status: "completed"
          });
        }
        showNotification(`Uploaded media file successfully as "${finalTitle}"!`);
        await loadRecordingsData();
      } catch (err) {
        console.error(err);
        showNotification("Failed to upload recording assets to database.");
      } finally {
        setIsUploading(false);
        setUploadModalOpen(false);
        setUploadFile(null);
        setAssociatedMeetingId("");
      }
    }, 1000);
  };

  const filteredRecordings = recordingsList.filter(r => 
    r.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      
      {/* Toast alert banner */}
      {notification && (
        <div className="fixed top-5 right-5 z-50 bg-[#070B24] border border-violet-500/30 text-white text-xs font-semibold py-3 px-5 rounded-2xl shadow-2xl flex items-center gap-2 animate-in slide-in-from-top duration-300">
          <CheckCircle2 size={16} className="text-emerald-500" />
          <span>{notification}</span>
        </div>
      )}

      {/* Toolbar controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="relative w-full max-w-sm">
          <input
            type="text"
            placeholder="Search recordings by title..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-slate-950/60 border border-slate-800 rounded-xl py-2.5 pl-9 pr-4 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-violet-500 transition-colors"
          />
          <Search size={14} className="absolute left-3.5 top-3.5 text-slate-500" />
        </div>

        <button 
          onClick={() => {
            setUploadFile(null);
            setAssociatedMeetingId("");
            setUploadProgress(0);
            setIsUploading(false);
            setUploadModalOpen(true);
          }}
          className="flex items-center gap-2 bg-violet-650 bg-violet-600 hover:bg-violet-500 text-white font-bold text-xs px-4 py-2.5 rounded-xl transition shadow-md shadow-violet-500/10 cursor-pointer self-start sm:self-center"
        >
          <Upload size={14} />
          Upload Recording File
        </button>
      </div>

      <RecordingTable 
        recordings={filteredRecordings}
        onPlay={handlePlay}
        onDownload={handleDownload}
        onDelete={handleDeleteTrigger}
      />

      <DeleteModal 
        isOpen={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleConfirmDelete}
        title="Delete Recording Archive?"
        message={deleteTarget ? `Are you sure you want to permanently delete "${deleteTarget.title}" (${deleteTarget.size})? This will release allocated cloud capacity.` : ''}
      />

      {/* Play Video simulation overlay Modal */}
      {playTarget && (
        <div className="fixed inset-0 bg-black/85 backdrop-blur flex items-center justify-center z-50 px-4 animate-in fade-in duration-200">
          <div className="bg-slate-950 border border-slate-800 rounded-2xl w-full max-w-2xl shadow-2xl p-6 relative text-slate-100 animate-in zoom-in-95 duration-200 space-y-4">
            <div className="flex justify-between items-center pb-2 border-b border-slate-800">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <PlayCircle size={16} className="text-violet-500 animate-pulse" />
                Playing Archive: {playTarget.title}
              </h3>
              <button onClick={() => setPlayTarget(null)} className="text-slate-400 hover:text-white">
                <X size={16} />
              </button>
            </div>

            {/* Media Player simulator screen */}
            <div className="w-full aspect-video rounded-xl bg-slate-900 border border-slate-800/80 flex flex-col items-center justify-center relative overflow-hidden">
              <div className="w-16 h-16 rounded-full bg-violet-600 flex items-center justify-center text-white cursor-pointer hover:scale-105 transition-transform shadow-lg shadow-violet-500/20">
                <PlayCircle size={32} />
              </div>
              <span className="text-[10px] text-slate-500 font-bold uppercase tracking-widest mt-3">
                IntellMeet Media Playback Simulator
              </span>
              
              {/* Bottom controls panel simulation */}
              <div className="absolute bottom-0 inset-x-0 h-10 bg-slate-950/80 border-t border-slate-800 px-4 flex items-center justify-between text-[10px] text-slate-400 font-bold">
                <span>00:00 / {playTarget.duration}</span>
                <span>File size: {playTarget.size}</span>
              </div>
            </div>

            <button 
              onClick={() => setPlayTarget(null)}
              className="w-full py-2.5 rounded-xl text-slate-200 bg-slate-900 border border-slate-800 hover:bg-slate-850 hover:text-white transition text-xs font-bold"
            >
              Close Media Player
            </button>
          </div>
        </div>
      )}

      {/* Upload Modal Overlay */}
      {uploadModalOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 px-4 animate-in fade-in duration-200">
          <form 
            onSubmit={handleUploadSubmit}
            className="bg-slate-950 border border-slate-800 rounded-2xl w-full max-w-md shadow-2xl p-6 relative text-slate-100 animate-in zoom-in-95 duration-200 space-y-4"
          >
            <div className="flex justify-between items-center pb-2 border-b border-slate-800">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <Upload size={16} className="text-violet-500" />
                Upload Conference Tape
              </h3>
              <button type="button" onClick={() => setUploadModalOpen(false)} className="text-slate-400 hover:text-white">
                <X size={16} />
              </button>
            </div>

            {isUploading ? (
              <div className="py-8 space-y-4 text-center text-xs">
                <div className="w-10 h-10 rounded-full border-2 border-slate-850 border-t-violet-500 animate-spin mx-auto" />
                <div className="space-y-1">
                  <p className="font-bold text-white">Uploading media track...</p>
                  <p className="text-slate-500 text-[10px]">Processing data chunks and generating AI pipelines</p>
                </div>
                <div className="w-full bg-slate-900 border border-slate-800 rounded-full h-2.5 overflow-hidden max-w-xs mx-auto">
                  <div className="h-full bg-gradient-to-r from-violet-650 to-indigo-650 rounded-full transition-all duration-150" style={{ width: `${uploadProgress}%` }} />
                </div>
                <span className="text-[10px] text-slate-450 font-bold font-mono">{uploadProgress}%</span>
              </div>
            ) : (
              <div className="space-y-4 text-xs">
                <div>
                  <label className="block text-slate-400 font-bold mb-1.5 flex items-center gap-1"><Film size={12}/> Select Recording Media File</label>
                  <div className="border border-dashed border-slate-800 rounded-xl p-6 text-center bg-slate-900/50 hover:bg-slate-900 transition relative">
                    <input 
                      type="file" 
                      accept="video/*,audio/*"
                      onChange={handleFileChange}
                      required
                      className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
                    />
                    <Upload size={24} className="mx-auto text-slate-650 mb-2" />
                    <p className="font-bold text-slate-350">{uploadFile ? uploadFile.name : "Click to browse media files"}</p>
                    <p className="text-[10px] text-slate-500 mt-1">Supports MP4, WebM, WAV, MP3 up to 100MB</p>
                  </div>
                </div>

                <div>
                  <label className="block text-slate-400 font-bold mb-1.5 flex items-center gap-1"><Cpu size={12}/> Associate with Database Meeting (Optional)</label>
                  <select
                    value={associatedMeetingId}
                    onChange={(e) => setAssociatedMeetingId(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3.5 py-2.5 text-white focus:outline-none focus:border-violet-500 cursor-pointer"
                  >
                    <option value="">-- No Association (Use file name as title) --</option>
                    {meetingsList.map(m => (
                      <option key={m._id} value={m._id}>{m.title}</option>
                    ))}
                  </select>
                </div>

                <div className="flex justify-end gap-3 text-xs pt-2">
                  <button
                    type="button"
                    onClick={() => setUploadModalOpen(false)}
                    className="flex-1 py-2.5 rounded-xl text-slate-350 bg-slate-900 border border-slate-800 hover:bg-slate-850 hover:text-white transition font-bold"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 py-2.5 rounded-xl text-white bg-violet-650 bg-violet-600 hover:bg-violet-500 transition font-bold shadow-md shadow-violet-500/10 cursor-pointer"
                  >
                    Upload Media
                  </button>
                </div>
              </div>
            )}
          </form>
        </div>
      )}
    </div>
  );
};

export default Recordings;
