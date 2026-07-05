import { useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import MeetingHeader from "../../components/MeetingRoom/MeetingHeader";
import VideoGrid from "../../components/MeetingRoom/VideoGrid";
import BottomControls from "../../components/MeetingRoom/BottomControls";
import ChatPanel from "../../components/MeetingRoom/ChatPanel";
import ParticipantPanel from "../../components/MeetingRoom/ParticipantPanel";
import ScreenShare from "../../components/MeetingRoom/ScreenShare";
import LoadingMeeting from "../../components/MeetingRoom/LoadingMeeting";

import useMedia from "../../Hooks/useMedia";
import useScreenShare from "../../Hooks/useScreenSahre";
import useWebRTC from "../../Hooks/useWebRTC";

import socket from "../../Utils/socket";
import peer from "../../Utils/peer";
import api from "../../Utils/api";

const MeetingRoom = () => {
  const { roomId } = useParams();
  const navigate = useNavigate();

  const peerIdRef = useRef("");

  const [participants, setParticipants] = useState([]);
  const [meetingName, setMeetingName] = useState("IntellMeet");
  const [hostId, setHostId] = useState(null);
  const [myHandRaised, setMyHandRaised] = useState(false);
  const [showChat, setShowChat] = useState(false);
  const [showParticipants, setShowParticipants] = useState(false);
  const [messages, setMessages] = useState([]);

  // Unified Media Stream (Camera & Mic)
  const { stream, cameraOn, micOn, loading, toggleCamera, toggleMic } = useMedia();

  // Screen Share
  const { isSharing, screenStream, toggleScreenShare } = useScreenShare();

  // WebRTC
  const { remoteStreams, updateStream } = useWebRTC(roomId);

  // Stream update when camera stream or screen share stream changes
  useEffect(() => {
    if (isSharing && screenStream) {
      updateStream(screenStream);
    } else {
      updateStream(stream);
    }
  }, [stream, screenStream, isSharing, updateStream]);

  // Fetch meeting details from backend
  useEffect(() => {
    const fetchMeetingDetails = async () => {
      try {
        const token = localStorage.getItem("accessToken");

        let cleanId = roomId.trim();
        if (cleanId.includes("/")) {
          const parts = cleanId.split("/");
          cleanId = parts[parts.length - 1];
        }
        cleanId = cleanId.replace(/[^a-zA-Z0-9]/g, "").toLowerCase();
        if (cleanId.length === 9) {
          cleanId = `${cleanId.slice(0, 3)}-${cleanId.slice(3, 6)}-${cleanId.slice(6, 9)}`;
        }

        const res = await api.get(`/meetings/${cleanId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        if (res.data.success && res.data.meeting) {
          setMeetingName(res.data.meeting.title);
          setHostId(res.data.meeting.createdBy?._id || res.data.meeting.createdBy);
        } else {
          alert("Invalid Meeting ID!");
          navigate("/meetings");
        }
      } catch (error) {
        console.error("Error fetching meeting details:", error);
        alert("Invalid Meeting ID!");
        navigate("/meetings");
      }
    };

    fetchMeetingDetails();
  }, [roomId, navigate]);

  // Join Meeting
  useEffect(() => {
    if (loading) return;

    let resolved = false;

    const handleOpen = (peerId) => {
      if (resolved) return;
      resolved = true;
      peerIdRef.current = peerId;

      console.log("✅ Peer Connected:", peerId);

      const user = JSON.parse(localStorage.getItem("user")) || {};
      const userName = user.name || `User-${peerId ? peerId.slice(0, 5) : Math.random().toString(36).substring(2, 7)}`;
      const userId = user.id || user._id;

      socket.emit("join-room", {
        roomId,
        peerId,
        userName,
        userId,
      });
    };

    const handleParticipants = (users) => {
      console.log("Participants:", users);
      setParticipants(users);
    };

    const handleConnect = () => {
      console.log("✅ Socket Connected:", socket.id);
    };

    const handleChatHistory = (history) => {
      console.log("📜 Chat History:", history);
      setMessages(history || []);
    };

    const handleReceiveMessage = (message) => {
      console.log("💬 Receive Message:", message);
      setMessages((prev) => [...prev, message]);
    };

    let timer = null;

    if (peer.open) {
      handleOpen(peer.id);
    } else {
      peer.on("open", handleOpen);
      
      // Fallback timeout after 3 seconds so socket room joining is never blocked
      timer = setTimeout(() => {
        if (!resolved) {
          console.warn("PeerJS connection timed out. Joining socket room with fallback ID.");
          handleOpen(`temp-${socket.id || Math.random().toString(36).substring(2, 9)}`);
        }
      }, 3000);
    }

    const handleUserMuted = ({ targetPeerId, type }) => {
      const activePeerId = peerIdRef.current || peer.id;
      if (targetPeerId === activePeerId) {
        console.warn(`Host muted my ${type}`);
        if (type === "audio") {
          if (stream) {
            const track = stream.getAudioTracks()[0];
            if (track && track.enabled) {
              toggleMic();
            }
          }
        } else if (type === "video") {
          if (stream) {
            const track = stream.getVideoTracks()[0];
            if (track && track.enabled) {
              toggleCamera();
            }
          }
        }
      }
    };

    const handleUserKicked = ({ targetPeerId }) => {
      const activePeerId = peerIdRef.current || peer.id;
      if (targetPeerId === activePeerId) {
        alert("You have been kicked out of this meeting by the host.");
        leaveMeeting();
      }
    };

    socket.on("connect", handleConnect);
    socket.on("participants-update", handleParticipants);
    socket.on("chat-history", handleChatHistory);
    socket.on("receive-message", handleReceiveMessage);
    socket.on("user-muted", handleUserMuted);
    socket.on("user-kicked", handleUserKicked);

    return () => {
      if (timer) clearTimeout(timer);
      socket.off("connect", handleConnect);
      socket.off("participants-update", handleParticipants);
      socket.off("chat-history", handleChatHistory);
      socket.off("receive-message", handleReceiveMessage);
      socket.off("user-muted", handleUserMuted);
      socket.off("user-kicked", handleUserKicked);

      peer.off("open", handleOpen);

      socket.emit("leave-room", {
        roomId,
        peerId: peerIdRef.current,
      });
    };
  }, [roomId, loading, stream, toggleMic, toggleCamera]);

  if (loading) {
    return <LoadingMeeting />;
  }

  // Leave Meeting
  const leaveMeeting = () => {
    stream?.getTracks().forEach((track) => track.stop());

    navigate("/meetings");
  };

  // Send Message
  const sendMessage = (text) => {
    const activePeerId = peerIdRef.current || peer.id;
    if (!text.trim() || !activePeerId) return;
    const user = JSON.parse(localStorage.getItem("user")) || {};
    const userName = user.name || `User-${activePeerId.slice(0, 5)}`;
    const messageData = {
      roomId,
      senderId: activePeerId,
      senderName: userName,
      text,
      time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };
    socket.emit("send-message", messageData);
  };

  const toggleRaiseHand = () => {
    const newState = !myHandRaised;
    setMyHandRaised(newState);
    const activePeerId = peerIdRef.current || peer.id;
    if (activePeerId) {
      socket.emit("raise-hand", {
        roomId,
        peerId: activePeerId,
        raisedHand: newState,
      });
    }
  };

  console.log("Remote Streams:", remoteStreams);
  console.log("Participants:", participants);
  console.log("Local Stream:", stream);

  return (
    <div className="h-screen bg-slate-950 flex flex-col">
      <MeetingHeader
        meetingName={meetingName}
        roomId={roomId}
        participants={participants.length}
      />

      <div className="flex flex-1 overflow-hidden">
        <div className="flex-1 p-5">
          {isSharing ? (
            <ScreenShare
              isSharing={isSharing}
              screenStream={screenStream}
              sharedBy="You"
            />
          ) : (
            <VideoGrid
              stream={stream}
              remoteStreams={remoteStreams}
              participants={participants}
              micOn={micOn}
              cameraOn={cameraOn}
              hostId={hostId}
              myHandRaised={myHandRaised}
            />
          )}
        </div>

        <ChatPanel
          open={showChat}
          messages={messages}
          onSendMessage={sendMessage}
          currentUserId={peer.id}
          onClose={() => setShowChat(false)}
        />

        <ParticipantPanel
          open={showParticipants}
          participants={participants}
          hostId={hostId}
          localUserId={JSON.parse(localStorage.getItem("user"))?.id || JSON.parse(localStorage.getItem("user"))?._id}
          roomId={roomId}
        />
      </div>

      <BottomControls
        micOn={micOn}
        cameraOn={cameraOn}
        toggleMic={toggleMic}
        toggleCamera={toggleCamera}
        isSharing={isSharing}
        toggleScreenShare={toggleScreenShare}
        showChat={showChat}
        showParticipants={showParticipants}
        toggleChat={() => setShowChat(!showChat)}
        toggleParticipants={() => setShowParticipants(!showParticipants)}
        leaveMeeting={leaveMeeting}
        myHandRaised={myHandRaised}
        toggleRaiseHand={toggleRaiseHand}
      />
    </div>
  );
};

export default MeetingRoom;
