import { useState, useEffect } from "react";
import DashboardLayout from "../layouts/DashboardLayout";
import api from "../Utils/api";

// Reusable components
import SummarySelector from "../components/MeetingSummary/SummarySelector";
import SummaryDetailsCard from "../components/MeetingSummary/SummaryDetailsCard";

import { ClipboardList, FileText, Loader, X, FileCheck, Brain, Sparkles, CheckCircle } from "lucide-react";

const MeetingSummary = () => {
  const [meetings, setMeetings] = useState([]);
  const [selectedMeetingId, setSelectedMeetingId] = useState("");
  const [loading, setLoading] = useState(true);
  const [aiGenerating, setAiGenerating] = useState(false);
  const [notification, setNotification] = useState("");

  // Transcript modal overlay triggers
  const [transcriptModalOpen, setTranscriptModalOpen] = useState(false);
  const [selectedMeeting, setSelectedMeeting] = useState(null);

  const showNotification = (msg) => {
    setNotification(msg);
    setTimeout(() => setNotification(""), 3000);
  };

  const fetchMeetings = async (keepSelection = false) => {
    try {
      setLoading(true);
      const token = localStorage.getItem("accessToken");
      const res = await api.get("/meetings", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (res.data.success) {
        setMeetings(res.data.meetings || []);
        if (!keepSelection) {
          setSelectedMeetingId("");
        }
      }
    } catch (err) {
      console.error("Error fetching completed meetings list for summaries:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMeetings();
  }, []);

  const activeMeeting = meetings.find((m) => m._id === selectedMeetingId);

  // Trigger Backend AI summary pipelines
  const handleGenerateAISummary = async (meetingId) => {
    const idToProcess = meetingId || selectedMeetingId;
    if (!idToProcess) return;

    try {
      setAiGenerating(true);
      showNotification("Triggering AI analysis engines...");
      const token = localStorage.getItem("accessToken");
      const res = await api.post(`/ai/process/${idToProcess}`, {}, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (res.data.success) {
        showNotification("AI summary generated successfully!");
        await fetchMeetings(true); // reload list but keep current selection
      }
    } catch (err) {
      console.error("AI pipeline trigger failed:", err);
      showNotification("AI pipeline failure. Check API configurations.");
    } finally {
      setAiGenerating(false);
    }
  };

  // Download AI summary report as Markdown (.md) file
  const handleDownloadSummary = (m) => {
    const dateStr = new Date(m.meetingDate).toLocaleString();
    const actionItemsText = m.actionItems && m.actionItems.length > 0
      ? m.actionItems.map((item) => `- [ ] ${item}`).join("\n")
      : "No action items recorded.";

    const decisionsText = m.keyDecisions && m.keyDecisions.length > 0
      ? m.keyDecisions.map((item) => `- ${item}`).join("\n")
      : "No critical decisions recorded.";

    const fileContent = `# AI Meeting Summary: ${m.title}
Date: ${dateStr}

## Overview Summary
${m.summary || "No summary text generated."}

## Action Items Checklist
${actionItemsText}

## Key Decisions Made
${decisionsText}
`;

    const blob = new Blob([fileContent], { type: "text/markdown;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", `${m.title.replace(/[^a-zA-Z0-9]/g, "_")}_Summary.md`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  // Open transcript dialog
  const handleReadTranscript = (m) => {
    setSelectedMeeting(m);
    setTranscriptModalOpen(true);
  };

  return (
    <DashboardLayout>
      <div className="bg-white border border-gray-200 rounded-2xl p-8 shadow-sm space-y-6">
        
        {/* Banner Alert Notification */}
        {notification && (
          <div className="fixed bottom-5 right-5 bg-slate-900 text-white rounded-xl px-5 py-3.5 shadow-2xl flex items-center gap-3 z-50 animate-bounce">
            <CheckCircle className="text-emerald-400" size={20} />
            <span className="text-sm font-medium">{notification}</span>
          </div>
        )}

        {/* Header Title */}
        <div>
          <h1 className="text-3xl font-bold text-slate-900 mb-2">Meeting Summary</h1>
          <p className="text-slate-500">Access AI-generated transcripts, action items, and structural outlines from previous sessions.</p>
        </div>

        {/* Dynamic Context Selector */}
        {loading && meetings.length === 0 ? (
          <div className="py-10 text-center">
            <Loader className="mx-auto animate-spin text-violet-600" size={32} />
            <p className="text-slate-400 text-xs font-bold mt-2">Refreshing meetings data...</p>
          </div>
        ) : (
          <SummarySelector
            selectedMeetingId={selectedMeetingId}
            setSelectedMeetingId={setSelectedMeetingId}
            meetings={meetings}
          />
        )}

        {/* Details card or empty banner */}
        {!selectedMeetingId ? (
          <div className="bg-slate-50 border border-dashed rounded-2xl p-16 text-center text-slate-500 text-sm font-semibold">
            💡 Choose a meeting from the context dropdown above to load the AI-generated meeting summary, key decisions, and action items checklist.
          </div>
        ) : activeMeeting ? (
          <div>
            {!activeMeeting.summary ? (
              <div className="bg-gradient-to-r from-violet-50 to-indigo-50 border border-violet-100 rounded-2xl p-12 text-center text-slate-800 flex flex-col items-center justify-center space-y-4 shadow-sm animate-in fade-in duration-200">
                <Brain className="text-violet-600 animate-bounce" size={48} />
                <h3 className="text-lg font-bold text-slate-800">No AI Summary Generated Yet</h3>
                <p className="text-sm text-slate-550 max-w-sm font-medium">
                  This meeting doesn't have an AI analysis summary report. Click the button below to generate a dynamic outline, key decisions, and action checklists.
                </p>
                <button
                  onClick={() => handleGenerateAISummary(activeMeeting._id)}
                  disabled={aiGenerating}
                  className="px-6 py-3 bg-gradient-to-r from-violet-600 to-indigo-650 hover:from-violet-750 hover:to-indigo-750 text-white rounded-xl text-sm font-bold shadow-md flex items-center gap-2 transition cursor-pointer disabled:opacity-50"
                >
                  {aiGenerating ? (
                    <>
                      <Loader className="animate-spin text-white" size={16} />
                      <span>Generating Summary...</span>
                    </>
                  ) : (
                    <>
                      <Sparkles size={16} />
                      <span>Generate AI Summary</span>
                    </>
                  )}
                </button>
              </div>
            ) : (
              <SummaryDetailsCard
                meeting={activeMeeting}
                onDownload={handleDownloadSummary}
                onReadTranscript={handleReadTranscript}
                onRegenerate={handleGenerateAISummary}
                aiGenerating={aiGenerating}
              />
            )}
          </div>
        ) : (
          <div className="bg-rose-50 border border-rose-100 rounded-2xl p-8 text-center text-rose-600 text-sm font-bold">
            Selected meeting data not found. Please refresh page.
          </div>
        )}

      </div>

      {/* Transcript Modal Overlay */}
      {transcriptModalOpen && selectedMeeting && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 px-4">
          <div className="bg-white rounded-2xl w-full max-w-2xl shadow-2xl p-6 relative border border-slate-100 text-slate-905 flex flex-col max-h-[80vh] animate-in fade-in zoom-in-95 duration-200">
            
            <div className="flex items-center justify-between border-b pb-4 mb-4 flex-shrink-0">
              <div>
                <h3 className="text-xl font-bold text-slate-800">
                  Meeting Transcript
                </h3>
                <p className="text-xs text-slate-400 font-semibold mt-0.5">
                  {selectedMeeting.title}
                </p>
              </div>
              <button
                onClick={() => {
                  setTranscriptModalOpen(false);
                  setSelectedMeeting(null);
                }}
                className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-50 rounded-xl cursor-pointer"
              >
                <X size={18} />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto min-h-0 space-y-4 pr-1">
              {selectedMeeting.transcript ? (
                <div className="text-sm text-slate-600 leading-relaxed whitespace-pre-wrap font-medium bg-slate-50 p-5 rounded-2xl border">
                  {selectedMeeting.transcript}
                </div>
              ) : (
                <div className="py-16 text-center text-slate-400 font-semibold border border-dashed rounded-2xl">
                  <ClipboardList className="mx-auto text-slate-300 mb-3 animate-bounce" size={40} />
                  <span>Is meeting ki structural transcription logs filhal empty hain.</span>
                </div>
              )}
            </div>

            <div className="border-t pt-4 mt-4 flex justify-end flex-shrink-0">
              <button
                onClick={() => {
                  setTranscriptModalOpen(false);
                  setSelectedMeeting(null);
                }}
                className="px-5 py-2.5 bg-slate-900 hover:bg-slate-850 text-white rounded-xl text-xs font-semibold cursor-pointer"
              >
                Close Viewer
              </button>
            </div>

          </div>
        </div>
      )}

    </DashboardLayout>
  );
};

export default MeetingSummary;
