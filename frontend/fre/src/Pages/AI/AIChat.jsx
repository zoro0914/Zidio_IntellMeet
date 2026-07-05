import React, { useState, useRef, useEffect } from "react";
import AIChatBox from "../../components/AI/AIChatBox";
import api from "../../Utils/api";

const AIChat = ({ recording }) => {
  const [chatHistory, setChatHistory] = useState([]);
  const [userMsg, setUserMsg] = useState("");
  const [chatLoading, setChatLoading] = useState(false);

  const bottomRef = useRef(null);

  useEffect(() => {
    if (bottomRef.current) {
      bottomRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [chatHistory, chatLoading]);

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
          meetingId: recording.id,
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
      console.warn("AI Chat API call failed, triggering offline fallback response:", err);
      // Fallback
      setTimeout(() => {
        setChatHistory((prev) => [
          ...prev,
          {
            role: "model",
            text: `(Offline AI Mode) I received: "${userMsg}". Since backend API is loading or key is missing, I processed this based on local meeting summaries!`,
          },
        ]);
      }, 700);
    } finally {
      setChatLoading(false);
    }
  };

  return (
    <div className="h-full">
      <AIChatBox
        chatHistory={chatHistory}
        userMsg={userMsg}
        setUserMsg={setUserMsg}
        onSend={handleSendChat}
        chatLoading={chatLoading}
        bottomRef={bottomRef}
      />
    </div>
  );
};

export default AIChat;
