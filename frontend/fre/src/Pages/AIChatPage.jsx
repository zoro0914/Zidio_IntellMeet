import { useState, useEffect, useRef } from "react";
import DashboardLayout from "../layouts/DashboardLayout";
import api from "../Utils/api";
import AIChatBox from "../components/AI/AIChatBox";
import { Sparkles, HelpCircle, ArrowRight, Brain, Calendar, User } from "lucide-react";

const mockRecordings = [
  {
    id: "mock-1",
    title: "AI Features & Socket Integration Sync",
    host: "Sania Malhotra",
    date: "Jul 3, 2026",
    transcript: "00:02 Sania: Welcome everyone to our engineering sync. Let's look at the WebRTC setup.\n00:10 Harsh: Yes, I successfully tested peer connections across different browsers.\n00:20 Sania: Perfect! Did you run into any CORS problems?\n00:28 Harsh: Yes, but we fixed it completely by dynamically matching hostnames."
  },
  {
    id: "mock-2",
    title: "UI Layout & Responsive Sidebar Design",
    host: "Laxmi Prasad",
    date: "Jul 2, 2026",
    transcript: "00:01 Laxmi: Hey Sania, let's review the sidebar layout.\n00:12 Sania: The top menu links are getting cut off when height is constrained.\n00:22 Laxmi: I will wrap the links in a scrollable div and make the footer static."
  }
];

const AIChatPage = () => {
  const [meetings, setMeetings] = useState([]);
  const [selectedMeetingId, setSelectedMeetingId] = useState("global");
  const [activeMeeting, setActiveMeeting] = useState(null);

  // Chat conversation state
  const [chatHistory, setChatHistory] = useState([]);
  const [userMsg, setUserMsg] = useState("");
  const [chatLoading, setChatLoading] = useState(false);

  const bottomRef = useRef(null);

  // Fetch completed meetings
  const fetchMeetings = async () => {
    try {
      const token = localStorage.getItem("accessToken");
      const res = await api.get("/meetings", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const deletedIdsStr = localStorage.getItem("deletedMockIds");
      const deletedIds = deletedIdsStr ? JSON.parse(deletedIdsStr) : [];
      const activeMocks = mockRecordings.filter((m) => !deletedIds.includes(m.id));

      if (res.data.success) {
        const dbCompleted = (res.data.meetings || [])
          .filter((m) => m.summary || m.transcript)
          .map((m) => ({
            id: m._id,
            title: m.title,
            host: m.createdBy?.name || "User",
            date: new Date(m.meetingDate).toLocaleDateString(),
            transcript: m.transcript,
          }));

        setMeetings([...dbCompleted, ...activeMocks]);
      } else {
        setMeetings(activeMocks);
      }
    } catch (err) {
      console.warn("Could not load db meetings context, showing offline logs:", err);
      const deletedIdsStr = localStorage.getItem("deletedMockIds");
      const deletedIds = deletedIdsStr ? JSON.parse(deletedIdsStr) : [];
      const activeMocks = mockRecordings.filter((m) => !deletedIds.includes(m.id));
      setMeetings(activeMocks);
    }
  };

  useEffect(() => {
    fetchMeetings();
  }, []);

  // Update active meeting context details on dropdown select
  useEffect(() => {
    if (selectedMeetingId === "global") {
      setActiveMeeting(null);
    } else {
      const found = meetings.find((m) => m.id === selectedMeetingId);
      setActiveMeeting(found || null);
    }
    // Clear chat history when switching context
    setChatHistory([]);
  }, [selectedMeetingId, meetings]);

  const handleSendChat = async (e) => {
    e.preventDefault();
    if (!userMsg.trim()) return;

    const newMsg = { role: "user", text: userMsg };
    setChatHistory((prev) => [...prev, newMsg]);
    setUserMsg("");
    setChatLoading(true);

    try {
      const token = localStorage.getItem("accessToken");
      const res = await api.post(
        "/ai/chat",
        {
          meetingId: selectedMeetingId,
          chatHistory: chatHistory,
          userMessage: userMsg,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (res.data.success) {
        setChatHistory((prev) => [
          ...prev,
          { role: "model", text: res.data.response },
        ]);
      }
    } catch (err) {
      console.warn("AI Chat API failed, triggering local model fallback:", err);
      setTimeout(() => {
        setChatHistory((prev) => [
          ...prev,
          {
            role: "model",
            text: `(Offline AI Assistant) I processed: "${userMsg}". Selected context: ${
              activeMeeting ? `"${activeMeeting.title}"` : "Global Workspace"
            }.`,
          },
        ]);
      }, 700);
    } finally {
      setChatLoading(false);
    }
  };

  return (
    <DashboardLayout>
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 h-[calc(100vh-140px)] overflow-hidden">
        
        {/* Left Side: Select meeting logs context */}
        <div className="lg:col-span-4 bg-white border border-gray-200 rounded-2xl p-5 flex flex-col justify-between shadow-sm overflow-y-auto">
          <div className="space-y-6">
            <div>
              <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                <Sparkles className="text-violet-600" size={20} />
                <span>AI Chat Assistant</span>
              </h2>
              <p className="text-xs text-slate-405 mt-1">Select a meeting log to focus the AI bot context.</p>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Choose context</label>
              <select
                value={selectedMeetingId}
                onChange={(e) => setSelectedMeetingId(e.target.value)}
                className="w-full px-3.5 py-3 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-violet-500 bg-slate-50/50 text-sm font-semibold transition"
              >
                <option value="global">🌐 Global Workspace Assistant</option>
                {meetings.map((m) => (
                  <option key={m.id} value={m.id}>
                    📹 {m.title} ({m.date})
                  </option>
                ))}
              </select>
            </div>

            {/* Context Insights card block */}
            {activeMeeting ? (
              <div className="bg-slate-50/50 border border-gray-150 rounded-xl p-4 space-y-3 animate-in fade-in slide-in-from-bottom-2 duration-200">
                <div className="flex items-center gap-2 text-xs font-bold text-violet-600">
                  <Brain size={14} />
                  <span>Focused Context Active</span>
                </div>
                <h3 className="font-bold text-slate-800 text-sm">{activeMeeting.title}</h3>
                
                <div className="space-y-1.5 text-xs text-slate-500">
                  <p className="flex items-center gap-1.5">
                    <User size={12} className="text-slate-400" />
                    <span>Host: {activeMeeting.host}</span>
                  </p>
                  <p className="flex items-center gap-1.5">
                    <Calendar size={12} className="text-slate-400" />
                    <span>Date: {activeMeeting.date}</span>
                  </p>
                </div>
              </div>
            ) : (
              <div className="bg-violet-50/30 border border-violet-100/60 rounded-xl p-4 space-y-2">
                <div className="flex items-center gap-2 text-xs font-bold text-violet-600">
                  <Sparkles size={14} />
                  <span>Global Assistant Mode</span>
                </div>
                <p className="text-xs text-slate-500 leading-relaxed">
                  Ask general queries about platform usage, sidebar shortcuts, calendar schedules, or overall developer action checklists.
                </p>
              </div>
            )}
          </div>

          <div className="border-t pt-4 text-[10px] text-slate-400 leading-relaxed">
            💡 Select any specific meeting recording from the list, and the AI chatbot will instantly search and answer questions based entirely on that meeting's transcript!
          </div>
        </div>

        {/* Right Side: Chat Window */}
        <div className="lg:col-span-8 bg-white border border-gray-200 rounded-2xl p-5 shadow-sm flex flex-col overflow-hidden">
          <AIChatBox
            chatHistory={chatHistory}
            userMsg={userMsg}
            setUserMsg={setUserMsg}
            onSend={handleSendChat}
            chatLoading={chatLoading}
            bottomRef={bottomRef}
          />
        </div>

      </div>
    </DashboardLayout>
  );
};

export default AIChatPage;
