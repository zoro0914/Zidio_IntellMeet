import { useState, useRef, useEffect } from "react";
import DashboardLayout from "../layouts/DashboardLayout";
import api from "../Utils/api";

// Page-level AI subviews
import EmailSummary from "./AI/EmailSummary";
import SmartSearch from "./AI/SmartSearch";

// Reusable Recordings components
import RecordingCard from "../components/Recordings/RecordingCard";
import PlaybackModal from "../components/Recordings/PlaybackModal";
import DeleteConfirmModal from "../components/Recordings/DeleteConfirmModal";

// Lucide & SVG Icons
import {
  PlayCircle,
  HardDrive,
  Sparkles,
  Loader,
  CheckCircle,
} from "lucide-react";

const timeStringToSeconds = (str) => {
  if (!str) return 0;
  const parts = str.split(":").map(Number);
  if (parts.length === 2) {
    return parts[0] * 60 + parts[1];
  } else if (parts.length === 3) {
    return parts[0] * 3600 + parts[1] * 60 + parts[2];
  }
  return 0;
};

const mockRecordings = [
  {
    id: "mock-1",
    title: "AI Features & Socket Integration Sync",
    host: "Sania Malhotra",
    date: "Jul 3, 2026",
    duration: "00:43",
    size: 124, // MB
    videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4",
    isFavorite: true,
    thumbnailGradient: "from-violet-600 to-indigo-800",
    sentiment: "Positive",
    keywords: ["WebRTC", "Socket.IO", "CORS Policy", "React Routing", "Responsive UX"],
    summary: "The meeting focused on the migration of peer signaling interfaces and fixing CORS origin blockers that were preventing cross-browser validation. The team aligned on dynamic hostname resolution rules and outlined dashboard dropdown layout widgets.",
    actionItems: [
      "Harsh - Configure dynamic CORS allowed origins on production",
      "Sania - Verify camera and microphone fallbacks inside standard tabs",
      "Laxmi - Wrap sidebar menu lists inside scrollable viewport containers"
    ],
    keyDecisions: [
      "Agreed to dynamically bind frontend connection URLs to current window hostname",
      "Approved transition from static CORS configuration to regex allowed origin matching",
      "Decided to pin footer elements inside responsive sidebar layout panels"
    ],
    transcript: [
      { time: "00:02", speaker: "Sania", text: "Welcome everyone to our engineering sync. Let's look at the WebRTC setup." },
      { time: "00:10", speaker: "Harsh", text: "Yes, I successfully tested peer connections across different browsers on the local network." },
      { time: "00:20", speaker: "Sania", text: "Perfect! Did you run into any CORS problems during your multi-browser tests?" },
      { time: "00:28", speaker: "Harsh", text: "Yes, we did. But we fixed it completely by dynamically matching the request hostnames." },
      { time: "00:38", speaker: "Sania", text: "That is excellent news. Let's wrap up this phase and prepare for staging." }
    ],
    highlights: [
      { time: "00:10", text: "Harsh: Peer connections tested successfully." },
      { time: "00:28", text: "Harsh: Fixed CORS using dynamic hostnames." }
    ],
    emailSummary: "Subject: Meeting Summary - AI Features & Socket Integration Sync\n\nDear Team,\n\nHere is the summary and action items from the meeting:\n\nSummary:\nThe meeting focused on the migration of peer signaling interfaces and fixing CORS origin blockers.\n\nAction Items:\n- Harsh - Configure dynamic CORS allowed origins\n- Sania - Verify camera and microphone fallbacks\n- Laxmi - Wrap sidebar menu lists\n\nBest Regards,\nMeeting AI Assistant"
  },
  {
    id: "mock-2",
    title: "UI Layout & Responsive Sidebar Design",
    host: "Laxmi Prasad",
    date: "Jul 2, 2026",
    duration: "00:35",
    size: 58, // MB
    videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4",
    isFavorite: false,
    thumbnailGradient: "from-fuchsia-600 to-pink-800",
    sentiment: "Neutral",
    keywords: ["CSS Grid", "Flexbox", "Responsive", "Layout", "Sidebar"],
    summary: "Sidebar links container updated to scroll internally, preventing item cutoffs on low screen heights. Outer dashboard layout wrapper locked to screen viewport height with independent main page scrolling.",
    actionItems: [
      "Laxmi - Wrap sidebar link lists in a scrollable flex layout",
      "Sania - Verify responsiveness of grid layout items in small screens"
    ],
    keyDecisions: [
      "Decided to replace scrollable viewport settings with a locked viewport framework",
      "Approved the removal of custom side-scrolling layouts in dashboard metrics panels"
    ],
    transcript: [
      { time: "00:01", speaker: "Laxmi", text: "Hey Sania, let's review the sidebar layout on smaller mobile devices." },
      { time: "00:12", speaker: "Sania", text: "Sure. I noticed that the top menu links are getting cut off when height is constrained." },
      { time: "00:22", speaker: "Laxmi", text: "Right. I will wrap the links in a scrollable div and make the footer static." },
      { time: "00:32", speaker: "Sania", text: "Perfect, that should make the dashboard fully responsive across all viewports." }
    ],
    highlights: [
      { time: "00:22", text: "Laxmi: Wrap links in scrollable div." }
    ],
    emailSummary: "Subject: Meeting Summary - UI Layout Design\n\nDear Team,\n\nHere is the summary:\n\nSidebar links container updated to scroll internally. Layout locked to screen viewport height.\n\nBest Regards,\nMeeting AI Assistant"
  }
];

const Recordings = () => {
  const [dbMeetings, setDbMeetings] = useState([]);
  const [recordings, setRecordings] = useState(() => {
    const deletedIdsStr = localStorage.getItem("deletedMockIds");
    const deletedIds = deletedIdsStr ? JSON.parse(deletedIdsStr) : [];
    return mockRecordings.filter((m) => !deletedIds.includes(m.id));
  });
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);

  // Get deleted mock IDs from localStorage
  const getDeletedMockIds = () => {
    const ids = localStorage.getItem("deletedMockIds");
    return ids ? JSON.parse(ids) : [];
  };

  const addDeletedMockId = (id) => {
    const ids = getDeletedMockIds();
    if (!ids.includes(id)) {
      ids.push(id);
      localStorage.setItem("deletedMockIds", JSON.stringify(ids));
    }
  };

  // Semantic Search Toggle state
  const [isAISearch, setIsAISearch] = useState(false);
  const [aiSearchLoading, setAiSearchLoading] = useState(false);

  // Dynamic AI trigger loading
  const [processingId, setProcessingId] = useState(null);

  // Modal display controllers
  const [activeVideo, setActiveVideo] = useState(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState(null);
  const [emailShareVideo, setEmailShareVideo] = useState(null);
  const [notification, setNotification] = useState("");

  // Video details modal tab active selection
  const [modalTab, setModalTab] = useState("summary"); // "summary" | "actions" | "transcript" | "highlights" | "chat"

  const videoPlayerRef = useRef(null);

  // Cloud metrics calculation
  const totalCapacity = 5120; // 5.0 GB in MB
  const usedStorage = recordings.reduce((acc, rec) => acc + (rec.size || 50), 0);
  const storagePercentage = ((usedStorage / totalCapacity) * 100).toFixed(1);

  // Toast Alerts Trigger
  const showNotification = (msg) => {
    setNotification(msg);
    setTimeout(() => setNotification(""), 3000);
  };

  // Fetch Database Meetings
  const fetchDbMeetings = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("accessToken");
      const res = await api.get("/meetings", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (res.data.success) {
        const formattedMeetings = (res.data.meetings || []).map((m) => ({
          ...m,
          id: m._id,
          size: m.size || 60,
          duration: m.duration || "00:45",
          videoUrl: m.videoUrl || "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4",
          thumbnailGradient: m.summary ? "from-indigo-600 to-blue-800" : "from-slate-600 to-slate-800",
          isFavorite: m.isFavorite || false,
          summary: m.summary || "",
          actionItems: m.actionItems || [],
          keyDecisions: m.keyDecisions || [],
          keywords: m.keywords || [],
          sentiment: m.sentiment || "",
          highlights: m.highlights || [],
          transcript: m.transcript ? parseTranscript(m.transcript) : [],
          emailSummary: m.emailSummary || "",
        }));

        const deletedIds = getDeletedMockIds();
        const activeMocks = mockRecordings.filter((m) => !deletedIds.includes(m.id));

        setDbMeetings(formattedMeetings);
        setRecordings([...formattedMeetings, ...activeMocks]);
      }
    } catch (err) {
      console.error("Error fetching db meetings:", err);
    } finally {
      setLoading(false);
    }
  };

  // Parse Text Transcripts to timeline arrays
  const parseTranscript = (text) => {
    if (!text) return [];
    if (typeof text !== "string") return text;
    try {
      const lines = text.split("\n");
      return lines.map((line) => {
        const match = line.match(/^(\d{2}:\d{2})\s+([\w\s]+):\s*(.*)$/);
        if (match) {
          return { time: match[1], speaker: match[2], text: match[3] };
        }
        return { time: "00:00", speaker: "Speaker", text: line };
      });
    } catch (e) {
      return [{ time: "00:00", speaker: "Transcript", text }];
    }
  };

  useEffect(() => {
    fetchDbMeetings();
  }, []);

  // Trigger Semantic Searches
  const handleAISearch = async () => {
    if (!isAISearch) return;
    if (!searchQuery.trim()) {
      fetchDbMeetings();
      return;
    }

    try {
      setAiSearchLoading(true);
      const token = localStorage.getItem("accessToken");
      const res = await api.get(`/ai/search?q=${encodeURIComponent(searchQuery)}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (res.data.success) {
        const matchedIds = (res.data.meetings || []).map((m) => m._id);
        const matched = recordings.filter((rec) => matchedIds.includes(rec.id) || rec.id.startsWith("mock-"));
        setRecordings(matched);
        showNotification(`Found ${res.data.meetings.length} relevant meetings!`);
      }
    } catch (err) {
      console.error("Semantic search failed:", err);
      showNotification("Semantic search failed. Using local text matches.");
    } finally {
      setAiSearchLoading(false);
    }
  };

  // Trigger search on typing change
  useEffect(() => {
    if (!isAISearch) {
      const deletedIds = getDeletedMockIds();
      const activeMocks = mockRecordings.filter((m) => !deletedIds.includes(m.id));
      setRecordings([
        ...dbMeetings.filter(
          (m) =>
            m.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            m.host.toLowerCase().includes(searchQuery.toLowerCase())
        ),
        ...activeMocks.filter(
          (m) =>
            m.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            m.host.toLowerCase().includes(searchQuery.toLowerCase())
        ),
      ]);
    }
  }, [searchQuery, isAISearch, dbMeetings]);

  // Run Backend AI Pipelines on specific meeting
  const handleProcessAI = async (meetingId) => {
    setProcessingId(meetingId);
    showNotification("Triggering backend AI analysis engines...");
    try {
      const token = localStorage.getItem("accessToken");
      const res = await api.post(`/ai/process/${meetingId}`, {}, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (res.data.success) {
        showNotification("AI analysis finished successfully!");
        fetchDbMeetings();
        if (activeVideo && activeVideo.id === meetingId) {
          const updatedRec = {
            ...res.data.meeting,
            id: res.data.meeting._id,
            size: res.data.meeting.size || 60,
            duration: res.data.meeting.duration || "00:45",
            thumbnailGradient: "from-indigo-600 to-blue-800",
            transcript: parseTranscript(res.data.meeting.transcript),
          };
          setActiveVideo(updatedRec);
        }
      }
    } catch (err) {
      console.error("AI pipeline trigger failed:", err);
      showNotification("AI pipeline failure. Check API key configs.");
    } finally {
      setProcessingId(null);
    }
  };

  // Favorites Bookmarks Toggle
  const handleToggleFavorite = (id) => {
    setRecordings((prev) =>
      prev.map((rec) =>
        rec.id === id ? { ...rec, isFavorite: !rec.isFavorite } : rec
      )
    );
    const rec = recordings.find((r) => r.id === id);
    showNotification(rec.isFavorite ? "Removed from Favorites" : "Added to Favorites");
  };

  // Copy share links
  const handleShare = (rec) => {
    const shareLink = `${window.location.origin}/meeting/${rec.title.replace(/\s+/g, "-").toLowerCase()}?ref=${rec.id}`;
    navigator.clipboard.writeText(shareLink).then(() => {
      showNotification("Meeting share link copied to clipboard!");
    });
  };

  // Trigger download dynamically to local system Downloads folder
  const handleDownload = async (rec) => {
    showNotification(`Preparing download for "${rec.title}"...`);
    try {
      const response = await fetch(rec.videoUrl);
      const blob = await response.blob();
      const blobUrl = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = blobUrl;
      link.setAttribute("download", `${rec.title.replace(/\s+/g, "_")}.mp4`);
      document.body.appendChild(link);
      link.click();
      link.parentNode.removeChild(link);
      window.URL.revokeObjectURL(blobUrl);
      showNotification(`"${rec.title}" downloaded successfully!`);
    } catch (err) {
      console.warn("Blob download failed, falling back to direct link download:", err);
      const link = document.createElement("a");
      link.href = rec.videoUrl;
      link.setAttribute("download", `${rec.title.replace(/\s+/g, "_")}.mp4`);
      link.setAttribute("target", "_blank");
      document.body.appendChild(link);
      link.click();
      link.parentNode.removeChild(link);
      showNotification(`Starting download for "${rec.title}"...`);
    }
  };

  // Delete handlers
  const handleDeleteConfirm = (id) => {
    setDeleteConfirmId(id);
  };

  const executeDelete = async () => {
    try {
      if (deleteConfirmId && !deleteConfirmId.startsWith("mock-")) {
        const token = localStorage.getItem("accessToken");
        const res = await api.delete(`/meetings/${deleteConfirmId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        if (res.data.success) {
          showNotification("Recording deleted successfully.");
          fetchDbMeetings();
        }
      } else {
        setRecordings((prev) => prev.filter((rec) => rec.id !== deleteConfirmId));
        addDeletedMockId(deleteConfirmId);
        showNotification("Recording deleted successfully.");
      }
    } catch (err) {
      console.error("Error deleting meeting recording:", err);
      showNotification("Failed to delete recording.");
    } finally {
      setDeleteConfirmId(null);
    }
  };

  // Jump to specific timestamp seconds on HTML5 Video Player
  const handleJumpToTime = (timeStr) => {
    if (videoPlayerRef.current) {
      const secs = timeStringToSeconds(timeStr);
      videoPlayerRef.current.currentTime = secs;
      videoPlayerRef.current.play();
    }
  };

  const openVideoPlayer = (rec) => {
    setActiveVideo(rec);
    setModalTab("summary");
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        
        {/* Banner Notification */}
        {notification && (
          <div className="fixed bottom-5 right-5 bg-slate-900 text-white rounded-xl px-5 py-3.5 shadow-2xl flex items-center gap-3 z-50 animate-bounce">
            <CheckCircle className="text-emerald-400" size={20} />
            <span className="text-sm font-medium">{notification}</span>
          </div>
        )}

        {/* Heading Section and SmartSearch Component */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
          <div>
            <h1 className="text-3xl font-bold text-slate-900">Recordings</h1>
            <p className="text-slate-500 mt-1">Access, playback, and review your team's cloud meeting logs.</p>
          </div>

          <SmartSearch
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            isAISearch={isAISearch}
            setIsAISearch={setIsAISearch}
            onSearch={handleAISearch}
            aiSearchLoading={aiSearchLoading}
          />
        </div>

        {/* Storage Widget Dashboard Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm flex items-center gap-5">
            <div className="w-12 h-12 bg-violet-50 text-violet-600 rounded-xl flex items-center justify-center flex-shrink-0">
              <HardDrive size={24} />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between text-sm font-semibold text-slate-700 mb-1.5">
                <span>Cloud Storage Capacity</span>
                <span>{usedStorage} MB / 5.0 GB</span>
              </div>
              <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                <div
                  className="bg-gradient-to-r from-violet-600 to-indigo-600 h-full rounded-full transition-all duration-500"
                  style={{ width: `${Math.min(storagePercentage, 100)}%` }}
                />
              </div>
              <p className="text-xs text-slate-400 mt-2 font-medium">
                {storagePercentage}% of your total cloud storage limit is currently in use.
              </p>
            </div>
          </div>

          <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm flex items-center gap-5">
            <div className="w-12 h-12 bg-amber-50 text-amber-600 rounded-xl flex items-center justify-center flex-shrink-0">
              <PlayCircle size={24} />
            </div>
            <div>
              <p className="text-sm text-slate-400 font-semibold">Total Cloud Logs</p>
              <h3 className="text-2xl font-bold text-slate-800 mt-1">{recordings.length} Videos</h3>
            </div>
          </div>

          <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm flex items-center gap-5">
            <div className="w-12 h-12 bg-emerald-50 text-emerald-600 rounded-xl flex items-center justify-center flex-shrink-0">
              <Sparkles size={24} />
            </div>
            <div>
              <p className="text-sm text-slate-400 font-semibold">Analyzed Logs</p>
              <h3 className="text-2xl font-bold text-slate-800 mt-1 font-semibold">
                {recordings.filter((r) => r.summary).length} Complete
              </h3>
            </div>
          </div>

        </div>

        {/* Listings Display Grid */}
        {loading ? (
          <div className="py-24 text-center">
            <Loader className="mx-auto animate-spin text-violet-600 mb-4" size={40} />
            <p className="text-slate-500 font-medium">Fetching dashboard meeting records...</p>
          </div>
        ) : recordings.length === 0 ? (
          <div className="bg-white border border-gray-200 rounded-2xl p-16 text-center shadow-sm">
            <PlayCircle className="mx-auto text-slate-300 mb-4" size={64} />
            <h3 className="text-lg font-bold text-slate-700">No recordings found</h3>
            <p className="text-slate-400 text-sm mt-1">
              There are no meeting recording logs available at the moment. Try creating a meeting first.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {recordings.map((rec) => (
              <RecordingCard
                key={rec.id}
                rec={rec}
                onPlay={openVideoPlayer}
                onProcessAI={handleProcessAI}
                onToggleFavorite={handleToggleFavorite}
                onShare={handleShare}
                onDownload={handleDownload}
                onDelete={handleDeleteConfirm}
                onEmailShare={setEmailShareVideo}
                processingId={processingId}
              />
            ))}
          </div>
        )}

        {/* Delete Confirmation Modal */}
        <DeleteConfirmModal
          isOpen={!!deleteConfirmId}
          onClose={() => setDeleteConfirmId(null)}
          onConfirm={executeDelete}
        />

        {/* Email sharing dialog draft */}
        {emailShareVideo && (
          <EmailSummary
            recording={emailShareVideo}
            onClose={() => setEmailShareVideo(null)}
            onCopy={() => {
              navigator.clipboard.writeText(emailShareVideo.emailSummary);
              showNotification("Email summary copied to clipboard!");
              setEmailShareVideo(null);
            }}
          />
        )}

        {/* Interactive Playback & AI Detail Modal */}
        {activeVideo && (
          <PlaybackModal
            activeVideo={activeVideo}
            onClose={() => setActiveVideo(null)}
            videoPlayerRef={videoPlayerRef}
            modalTab={modalTab}
            setModalTab={setModalTab}
            onJumpToTime={handleJumpToTime}
          />
        )}

      </div>
    </DashboardLayout>
  );
};

export default Recordings;
