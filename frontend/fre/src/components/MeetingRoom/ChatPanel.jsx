import { useState, useEffect, useRef } from "react";
import { X, Send } from "lucide-react";

const ChatPanel = ({ open, messages = [], onSendMessage, currentUserId, onClose }) => {
  const [inputText, setInputText] = useState("");
  const messagesEndRef = useRef(null);

  // Scroll to bottom when new messages arrive or chat opens
  useEffect(() => {
    if (open) {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, open]);

  if (!open) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!inputText.trim()) return;
    onSendMessage(inputText);
    setInputText("");
  };

  return (
    <div className="w-80 bg-slate-900 text-white flex flex-col h-full border-l border-slate-700">
      {/* Header */}
      <div className="p-4 border-b border-slate-800 flex justify-between items-center bg-slate-900/50 backdrop-blur-md">
        <div>
          <h2 className="text-lg font-semibold tracking-wide">Room Chat</h2>
          <p className="text-xs text-slate-400">
            {messages.length} {messages.length === 1 ? "message" : "messages"}
          </p>
        </div>
        <button
          onClick={onClose}
          className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition"
          title="Close Chat"
        >
          <X size={18} />
        </button>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-center p-4">
            <div className="w-12 h-12 rounded-full bg-slate-800 flex items-center justify-center mb-3 text-slate-500">
              💬
            </div>
            <p className="text-sm text-slate-400">No messages yet.</p>
            <p className="text-xs text-slate-500 mt-1">
              Send a message to start the conversation!
            </p>
          </div>
        ) : (
          messages.map((msg, index) => {
            const isMe = msg.senderId === currentUserId;
            return (
              <div
                key={index}
                className={`flex flex-col ${isMe ? "items-end" : "items-start"}`}
              >
                <div className="flex items-center gap-1.5 mb-1">
                  {!isMe && (
                    <span className="text-xs font-semibold text-violet-400">
                      {msg.senderName}
                    </span>
                  )}
                  <span className="text-[10px] text-slate-500">{msg.time}</span>
                </div>
                <div
                  className={`max-w-[85%] rounded-2xl px-4 py-2 text-sm leading-relaxed break-words shadow-sm ${
                    isMe
                      ? "bg-violet-600 text-white rounded-tr-none"
                      : "bg-slate-800 text-slate-100 rounded-tl-none"
                  }`}
                >
                  {msg.text}
                </div>
              </div>
            );
          })
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <form
        onSubmit={handleSubmit}
        className="p-3 border-t border-slate-800 bg-slate-900/80 backdrop-blur-md flex items-center gap-2"
      >
        <input
          type="text"
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          placeholder="Type a message..."
          className="flex-1 bg-slate-800 text-white text-sm rounded-xl px-4 py-2.5 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-violet-500 border border-transparent focus:border-transparent transition"
        />
        <button
          type="submit"
          disabled={!inputText.trim()}
          className={`p-2.5 rounded-xl text-white transition flex items-center justify-center ${
            inputText.trim()
              ? "bg-violet-600 hover:bg-violet-700 cursor-pointer"
              : "bg-slate-800 text-slate-500 cursor-not-allowed"
          }`}
        >
          <Send size={16} />
        </button>
      </form>
    </div>
  );
};

export default ChatPanel;