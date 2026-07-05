import { useState, useEffect, useRef } from "react";
import { Send, Hash, MessageSquare } from "lucide-react";

const ChatArea = ({ team, messages, onSendMessage, currentUser }) => {
  const [typedMessage, setTypedMessage] = useState("");
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, team]);

  if (!team) {
    return (
      <div className="flex-1 bg-gray-50/30 flex flex-col items-center justify-center text-center p-8">
        <div className="w-16 h-16 rounded-2xl bg-white border border-gray-200 flex items-center justify-center text-violet-600 mb-4 shadow-md">
          <MessageSquare size={32} />
        </div>
        <h3 className="text-xl font-bold text-gray-800 mb-2">Welcome to Team Space</h3>
        <p className="text-sm text-slate-500 max-w-sm">
          Select a team from the sidebar to view discussions, share notes, and collaborate with members in real-time.
        </p>
      </div>
    );
  }

  const handleSend = (e) => {
    e.preventDefault();
    if (!typedMessage.trim()) return;
    onSendMessage(typedMessage.trim());
    setTypedMessage("");
  };

  const formatMessageTime = (dateString) => {
    try {
      const date = new Date(dateString);
      return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
    } catch (e) {
      return "";
    }
  };

  const formatMessageDate = (dateString) => {
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString([], { month: "short", day: "numeric" });
    } catch (e) {
      return "";
    }
  };

  const renderMessageAvatar = (sender) => {
    const avatarValue = sender?.avatar;

    if (avatarValue && avatarValue.startsWith("data:image/")) {
      return (
        <img
          src={avatarValue}
          alt={sender?.name}
          className="object-cover w-full h-full rounded-full"
        />
      );
    }

    const presetGradients = {
      "preset-1": "from-violet-600 to-indigo-600",
      "preset-2": "from-emerald-500 to-teal-500",
      "preset-3": "from-amber-500 to-orange-500",
      "preset-4": "from-rose-500 to-red-500",
      "preset-5": "from-cyan-500 to-blue-500",
      "preset-6": "from-fuchsia-500 to-pink-500",
    };

    const gradientCss = presetGradients[avatarValue] || "from-violet-600 to-indigo-600";

    return (
      <div className={`w-full h-full rounded-full flex items-center justify-center text-[10px] font-bold bg-gradient-to-tr text-white ${gradientCss}`}>
        {sender?.name?.charAt(0)?.toUpperCase() || "U"}
      </div>
    );
  };

  return (
    <div className="flex-1 bg-gray-50/20 flex flex-col h-full overflow-hidden">
      {/* Active Team Header */}
      <div className="px-6 py-4 border-b border-gray-200 bg-white flex justify-between items-center">
        <div className="flex items-center gap-3 min-w-0">
          <div className="w-10 h-10 rounded-xl bg-violet-50 border border-violet-100 flex items-center justify-center text-violet-600 flex-shrink-0">
            <Hash size={20} />
          </div>
          <div className="min-w-0">
            <h3 className="text-base font-bold text-gray-800 truncate">{team.name}</h3>
            <p className="text-xs text-slate-450 truncate max-w-md">
              {team.description || "No description provided"}
            </p>
          </div>
        </div>
      </div>

      {/* Messages Scroll Area */}
      <div className="flex-1 overflow-y-auto px-6 py-4 space-y-4 bg-gray-50/40 scrollbar-thin scrollbar-thumb-gray-200">
        {messages.length > 0 ? (
          messages.map((msg, index) => {
            const isSelf = msg.sender?._id === currentUser?.id || msg.sender === currentUser?.id;
            const showDateSeparator =
              index === 0 ||
              formatMessageDate(messages[index - 1].createdAt) !== formatMessageDate(msg.createdAt);

            return (
              <div key={msg._id || index} className="space-y-3">
                {showDateSeparator && (
                  <div className="flex justify-center items-center py-2">
                    <span className="text-[10px] px-3 py-0.5 rounded-full bg-gray-200/60 text-slate-500 font-medium">
                      {formatMessageDate(msg.createdAt)}
                    </span>
                  </div>
                )}

                <div className={`flex gap-3 max-w-[85%] ${isSelf ? "ml-auto flex-row-reverse" : ""}`}>
                  {/* Sender Avatar */}
                  <div className="w-8 h-8 rounded-full relative flex-shrink-0">
                    {renderMessageAvatar(msg.sender)}
                  </div>

                  {/* Bubble Container */}
                  <div className="flex flex-col gap-1">
                    {/* Sender name / timestamp */}
                    {!isSelf && (
                      <span className="text-[10px] font-semibold text-slate-400 px-1">
                        {msg.sender?.name || "Member"}
                      </span>
                    )}

                    {/* Chat Bubble content */}
                    <div
                      className={`px-4 py-2.5 rounded-2xl text-sm leading-relaxed shadow-sm ${isSelf
                        ? "bg-gradient-to-r from-violet-600 to-indigo-600 text-white rounded-tr-none"
                        : "bg-white text-slate-800 border border-gray-200/80 rounded-tl-none"
                        }`}
                    >
                      <p className="whitespace-pre-wrap break-words">{msg.content}</p>
                    </div>

                    {/* Timestamp */}
                    <span
                      className={`text-[9px] text-slate-400 px-1.5 ${isSelf ? "text-right" : "text-left"
                        }`}
                    >
                      {formatMessageTime(msg.createdAt || new Date())}
                    </span>
                  </div>
                </div>
              </div>
            );
          })
        ) : (
          <div className="h-full flex flex-col items-center justify-center text-center p-8 space-y-2">
            <div className="w-12 h-12 rounded-full bg-white border border-gray-200 flex items-center justify-center text-slate-400">
              <MessageSquare size={20} />
            </div>
            <p className="text-xs text-slate-400">This is the start of team chat. Say hello!</p>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Form */}
      <div className="p-4 border-t border-gray-200 bg-white">
        <form onSubmit={handleSend} className="flex gap-2 bg-gray-50 border border-gray-200 rounded-xl p-1 focus-within:border-violet-500 focus-within:bg-white transition-all">
          <input
            type="text"
            value={typedMessage}
            onChange={(e) => setTypedMessage(e.target.value)}
            placeholder={`Message #${team.name}...`}
            className="flex-1 bg-transparent text-sm text-slate-805 placeholder-slate-400 px-3.5 py-2.5 focus:outline-none"
          />
          <button
            type="submit"
            disabled={!typedMessage.trim()}
            className="p-2.5 bg-violet-600 hover:bg-violet-750 text-white rounded-lg transition-colors flex-shrink-0 disabled:opacity-40 disabled:cursor-not-allowed shadow-sm"
          >
            <Send size={16} />
          </button>
        </form>
      </div>
    </div>
  );
};

export default ChatArea;
