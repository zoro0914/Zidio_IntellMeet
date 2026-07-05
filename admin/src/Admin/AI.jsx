import React, { useState, useEffect } from 'react';
import api from '../Utils/api';
import { Cpu, RefreshCw, ClipboardCheck, Sparkles, BookOpen, AlertCircle, PlayCircle, MessageSquare } from 'lucide-react';

const AI = () => {
  const [meetings, setMeetings] = useState([]);
  const [activeItem, setActiveItem] = useState(null);
  
  const [loading, setLoading] = useState(false);
  const [processingId, setProcessingId] = useState(null);
  const [notification, setNotification] = useState("");
  
  const [manualTranscriptInput, setManualTranscriptInput] = useState("");

  const showNotification = (msg) => {
    setNotification(msg);
    setTimeout(() => setNotification(""), 4500);
  };

  const fetchMeetings = async () => {
    try {
      setLoading(true);
      const res = await api.get("/meetings");
      if (res.data.success) {
        setMeetings(res.data.meetings);
        // Set first item as active if none set
        if (res.data.meetings.length > 0 && !activeItem) {
          setActiveItem(res.data.meetings[0]);
        }
      }
    } catch (err) {
      console.error(err);
      showNotification("Failed to fetch meetings. Displaying local cache.");
      // Fallback offline mock
      const mockMeetings = [
        {
          _id: "m-1",
          title: "Product Sync & Design Huddle",
          transcript: "00:05 Harsh: We need to modularize our admin components.\n00:15 Sania: I agree, I will setup the Tailwind v4 index CSS rules.\n00:30 Laxmi: I will create the dashboard analytics SVGs.",
          summary: "The team aligned on refactoring the Admin application into modular components. Harsh tasked Sania with managing the CSS assets and Laxmi with drawing the custom SVG components.",
          actionItems: ["Refactor components into components/Admin/", "Configure Tailwind CSS integration in index.css", "Design and write SVG charts"],
          status: "completed",
          meetingDate: new Date().toISOString()
        }
      ];
      setMeetings(mockMeetings);
      setActiveItem(mockMeetings[0]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMeetings();
  }, []);

  const handleProcessAI = async (meetingId) => {
    try {
      setProcessingId(meetingId);
      const res = await api.post(`/ai/process/${meetingId}`, {
        manualTranscript: manualTranscriptInput || undefined
      });

      if (res.data.success) {
        showNotification("AI Real-time processing finished using Gemini!");
        // Update meetings list
        const updated = res.data.meeting;
        setMeetings(prev => prev.map(m => m._id === meetingId ? updated : m));
        setActiveItem(updated);
        setManualTranscriptInput("");
      }
    } catch (err) {
      console.error(err);
      showNotification("AI Processing failed: " + (err.response?.data?.message || err.message));
    } finally {
      setProcessingId(null);
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      
      {/* Alert toast */}
      {notification && (
        <div className="fixed top-5 right-5 z-50 bg-slate-950 border border-violet-500/40 text-white text-xs font-semibold py-3 px-5 rounded-2xl shadow-2xl flex items-center gap-2 animate-in slide-in-from-top duration-300">
          <span>{notification}</span>
        </div>
      )}

      {/* AI meetings selector panel */}
      <div className="bg-slate-950/60 border border-slate-800/60 rounded-2xl p-5 shadow-xl flex flex-col space-y-4 h-[600px] overflow-hidden">
        <h3 className="text-sm font-bold text-white flex items-center gap-2">
          <Sparkles size={16} className="text-violet-500" />
          Realtime AI Pipeline Dashboard
        </h3>
        
        {loading && meetings.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center text-slate-500 text-xs gap-2">
            <div className="w-6 h-6 border-2 border-slate-800 border-t-violet-500 rounded-full animate-spin" />
            <span>Fetching meeting index...</span>
          </div>
        ) : (
          <div className="flex-1 overflow-y-auto space-y-2 pr-1 scrollbar-none">
            {meetings.map(m => (
              <button
                key={m._id}
                onClick={() => {
                  setActiveItem(m);
                  setManualTranscriptInput("");
                }}
                className={`w-full text-left p-3.5 rounded-xl border text-xs font-bold transition-all flex flex-col gap-1.5 ${
                  activeItem?._id === m._id 
                    ? 'bg-slate-900 border-slate-700 text-white' 
                    : 'bg-slate-950/80 border-slate-850 hover:bg-slate-900/60 text-slate-400 hover:text-white'
                }`}
              >
                <span className="truncate">{m.title}</span>
                <div className="flex items-center justify-between w-full mt-1">
                  <span className="text-[9px] text-slate-500 font-normal">
                    {new Date(m.meetingDate).toLocaleDateString()}
                  </span>
                  <span className={`text-[8px] font-bold px-1.5 py-0.5 rounded-full ${
                    m.summary 
                      ? 'bg-emerald-500/10 text-emerald-450 border border-emerald-500/20 text-emerald-400' 
                      : 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                  }`}>
                    {m.summary ? 'AI Synced' : 'Needs Processing'}
                  </span>
                </div>
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Details Display Panel */}
      {activeItem ? (
        <div className="bg-slate-950/60 border border-slate-800/60 rounded-2xl p-6 shadow-xl lg:col-span-2 space-y-6 overflow-y-auto h-[600px] scrollbar-none">
          
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
            <div>
              <h3 className="text-sm font-black text-white">{activeItem.title}</h3>
              <p className="text-[10px] text-slate-500 mt-0.5">Date: {new Date(activeItem.meetingDate).toLocaleString()}</p>
            </div>
            <button
              onClick={() => handleProcessAI(activeItem._id)}
              disabled={processingId !== null}
              className="flex items-center gap-1.5 bg-violet-600 hover:bg-violet-500 text-white font-bold text-xs px-3.5 py-2 rounded-xl transition cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <RefreshCw size={13} className={processingId === activeItem._id ? 'animate-spin' : ''} />
              {activeItem.summary ? 'Regenerate Gemini AI' : 'Run Real-time AI'}
            </button>
          </div>

          {/* AI summary block */}
          {activeItem.summary ? (
            <div className="space-y-2.5">
              <h4 className="text-xs font-bold text-white flex items-center gap-1.5">
                <BookOpen size={14} className="text-violet-500" />
                AI Executive Summary
              </h4>
              <p className="text-xs text-slate-300 leading-relaxed bg-slate-900/40 p-4 rounded-xl border border-slate-850">
                {activeItem.summary}
              </p>
            </div>
          ) : (
            <div className="p-5 border border-slate-850 rounded-xl bg-slate-900/20 text-center text-xs text-slate-500 space-y-2">
              <AlertCircle className="mx-auto text-amber-500" size={24} />
              <p className="font-bold text-slate-400">No AI summary generated yet.</p>
              <p>Type a transcript below or hit "Run Real-time AI" to process this meeting using Google Gemini LLM.</p>
            </div>
          )}

          {/* Action items block */}
          {activeItem.actionItems && activeItem.actionItems.length > 0 && (
            <div className="space-y-3">
              <h4 className="text-xs font-bold text-white flex items-center gap-1.5">
                <ClipboardCheck size={14} className="text-emerald-500" />
                Detected Action Items
              </h4>
              <ul className="space-y-2 text-xs">
                {activeItem.actionItems.map((act, i) => (
                  <li key={i} className="flex items-start gap-2 bg-slate-900/40 border border-slate-850 p-3 rounded-xl">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 mt-1.5 flex-shrink-0" />
                    <span className="text-slate-300 leading-normal">{act}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Transcript input/editor */}
          <div className="space-y-3 pt-2">
            <h4 className="text-xs font-bold text-white flex items-center gap-1.5">
              <MessageSquare size={14} className="text-amber-500" />
              Transcription Editor (Optional)
            </h4>
            
            {activeItem.transcript && (
              <div className="text-[11px] text-slate-400 font-mono leading-relaxed bg-slate-950 p-4 rounded-xl border border-slate-850 max-h-32 overflow-y-auto">
                <span className="text-[9px] uppercase font-bold text-slate-650 block mb-2 border-b border-slate-800 pb-1">Current Logged Transcript</span>
                {activeItem.transcript}
              </div>
            )}

            <div className="space-y-2">
              <textarea
                value={manualTranscriptInput}
                onChange={(e) => setManualTranscriptInput(e.target.value)}
                placeholder="Paste or type meeting dialogs here to override/process...\nExample:\n00:05 Harsh: Setup the repository.\n00:10 Sania: Yes, I will do it."
                rows={4}
                className="w-full bg-slate-900 border border-slate-850 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-violet-500"
              />
              <span className="text-[9px] text-slate-500 block leading-tight">
                Entering a custom transcript here and clicking "Run Real-time AI" will send the text to Gemini to generate summaries, keywords, sentiment, and action items in real-time.
              </span>
            </div>
          </div>

        </div>
      ) : (
        <div className="bg-slate-950/60 border border-slate-800/60 rounded-2xl p-12 shadow-xl lg:col-span-2 flex flex-col items-center justify-center text-slate-500 text-xs gap-2 h-[600px]">
          <Cpu size={32} className="text-slate-700" />
          <span>Select any meeting from the list to test real-time AI capabilities.</span>
        </div>
      )}

    </div>
  );
};

export default AI;
