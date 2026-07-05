import { useState, useEffect } from "react";
import DashboardLayout from "../layouts/DashboardLayout";
import api from "../Utils/api";
import socket from "../Utils/socket";
import TeamList from "../components/Teams/TeamList";
import ChatArea from "../components/Teams/ChatArea";
import TeamMembers from "../components/Teams/TeamMembers";
import CreateTeamModal from "../components/Teams/CreateTeamModal";
import { Loader } from "lucide-react";

const Teams = () => {
  const [teams, setTeams] = useState([]);
  const [selectedTeam, setSelectedTeam] = useState(null);
  const [messages, setMessages] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  // Retrieve current user
  const currentUser = JSON.parse(localStorage.getItem("user")) || {};

  // Fetch initial teams list
  const fetchTeams = async () => {
    try {
      setLoading(true);
      const res = await api.get("/teams");
      if (res.data.success) {
        setTeams(res.data.teams || []);
      }
    } catch (err) {
      console.warn("Could not retrieve teams list:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTeams();
  }, []);

  // Fetch team chat history when selected team changes
  const fetchTeamMessages = async (teamId) => {
    try {
      const res = await api.get(`/teams/${teamId}/messages`);
      if (res.data.success) {
        setMessages(res.data.messages || []);
      }
    } catch (err) {
      console.warn("Could not load team messages:", err);
    }
  };

  // Socket joins/leaves when selected team changes
  useEffect(() => {
    if (!selectedTeam) return;

    // Join team socket room
    socket.emit("join-team", { teamId: selectedTeam._id });
    fetchTeamMessages(selectedTeam._id);

    // Socket listener for real-time messages
    const handleReceiveMessage = (msg) => {
      if (msg.team === selectedTeam._id) {
        setMessages((prev) => [...prev, msg]);
      }
    };

    socket.on("receive-team-message", handleReceiveMessage);

    return () => {
      socket.emit("leave-team", { teamId: selectedTeam._id });
      socket.off("receive-team-message", handleReceiveMessage);
    };
  }, [selectedTeam]);

  // Send message handler
  const handleSendMessage = (content) => {
    if (!selectedTeam || !currentUser.id) return;
    
    // Emit socket event (backend saves it and broadcasts)
    socket.emit("send-team-message", {
      teamId: selectedTeam._id,
      senderId: currentUser.id,
      content,
    });
  };

  // Team creation callback
  const handleTeamCreated = (newTeam) => {
    setTeams((prev) => [newTeam, ...prev]);
    setSelectedTeam(newTeam);
  };

  // Member added callback
  const handleMemberAdded = (updatedTeam) => {
    setSelectedTeam(updatedTeam);
    setTeams((prev) =>
      prev.map((t) => (t._id === updatedTeam._id ? updatedTeam : t))
    );
  };

  return (
    <DashboardLayout>
      <div className="h-[calc(100vh-8.5rem)] md:h-[calc(100vh-6.5rem)] flex bg-white border border-gray-200 rounded-2xl overflow-hidden text-slate-800 shadow-sm">
        {loading ? (
          <div className="flex-1 flex flex-col items-center justify-center bg-gray-50/10">
            <Loader className="animate-spin text-violet-600 mb-3" size={36} />
            <p className="text-slate-500 font-semibold">Synchronizing team environments...</p>
          </div>
        ) : (
          <>
            {/* Left Column: Team List */}
            <TeamList
              teams={teams}
              selectedTeam={selectedTeam}
              onSelectTeam={setSelectedTeam}
              onCreateTeamClick={() => setIsModalOpen(true)}
            />

            {/* Center Column: Chat Window */}
            <ChatArea
              team={selectedTeam}
              messages={messages}
              onSendMessage={handleSendMessage}
              currentUser={currentUser}
            />

            {/* Right Column: Active Members */}
            {selectedTeam && (
              <TeamMembers
                team={selectedTeam}
                onMemberAdded={handleMemberAdded}
              />
            )}
          </>
        )}
      </div>

      {/* Creation Modal */}
      <CreateTeamModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onTeamCreated={handleTeamCreated}
      />
    </DashboardLayout>
  );
};

export default Teams;
