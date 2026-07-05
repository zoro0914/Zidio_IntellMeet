import React from "react";
import { Sparkles, Send, Loader } from "lucide-react";

const AIChatBox = ({ chatHistory, userMsg, setUserMsg, onSend, chatLoading, bottomRef }) => {
  return (
    <div className="h-full flex flex-col overflow-hidden">
      
      {/* Messages scrolling container */}
      <div className="flex-1 overflow-y-auto space-y-4 pr-1 mb-4 min-h-0 bg-slate-50/50 p-4 border border-dashed rounded-xl">
        
        {/* Intro bubble */}
        <div className="bg-violet-50 border border-violet-100 text-violet-850 p-3.5 rounded-xl text-xs flex gap-2">
          <Sparkles size={16} className="flex-shrink-0 mt-0.5 text-violet-600 animate-bounce" />
          <p>
            I am your meeting assistant bot. Ask me questions like:
            <strong className="block mt-1">"CORS issue Harsh ne solve kiya?"</strong>
            <strong className="block mt-0.5">"What are the key decisions?"</strong>
          </p>
        </div>

        {chatHistory.map((chat, idx) => (
          <div
            key={idx}
            className={`flex ${chat.role === "user" ? "justify-end" : "justify-start"}`}
          >
            <div className={`max-w-[80%] rounded-2xl px-4 py-2.5 text-sm leading-relaxed shadow-sm ${
              chat.role === "user"
                ? "bg-violet-600 text-white font-medium rounded-tr-none"
                : "bg-white text-slate-700 border border-gray-150 rounded-tl-none"
            }`}>
              <p>{chat.text}</p>
            </div>
          </div>
        ))}

        {chatLoading && (
          <div className="flex justify-start">
            <div className="bg-white border border-gray-150 rounded-2xl rounded-tl-none px-4 py-2.5 text-slate-400 text-sm flex items-center gap-2">
              <Loader className="animate-spin text-violet-600" size={14} />
              <span>Analyzing...</span>
            </div>
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      {/* Input box form */}
      <form onSubmit={onSend} className="flex items-center gap-2 flex-shrink-0">
        <input
          type="text"
          value={userMsg}
          onChange={(e) => setUserMsg(e.target.value)}
          placeholder="Ask AI about this meeting..."
          className="flex-1 border border-gray-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-violet-500 transition shadow-sm bg-white"
        />
        <button
          type="submit"
          className="bg-violet-600 hover:bg-violet-700 text-white p-2.5 rounded-xl transition shadow-sm flex items-center justify-center flex-shrink-0"
        >
          <Send size={18} />
        </button>
      </form>

    </div>
  );
};

export default AIChatBox;
