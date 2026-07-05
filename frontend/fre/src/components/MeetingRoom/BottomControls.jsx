import {
  Mic,
  MicOff,
  Video,
  VideoOff,
  MessageSquare,
  Users,
  PhoneOff,
  MonitorUp,
  Hand,
} from "lucide-react";

const BottomControls = ({
  micOn,
  cameraOn,
  toggleMic,
  toggleCamera,

  isSharing,
  toggleScreenShare,

  // showChat,
  // showParticipants,
  toggleChat,
  toggleParticipants,

  leaveMeeting,
  myHandRaised,
  toggleRaiseHand,
}) => {
  return (
    <div className="h-20 bg-slate-900 flex justify-center items-center gap-5">

      <button
        onClick={toggleMic}
        className="p-4 rounded-full bg-slate-800 text-white"
      >
        {micOn ? <Mic /> : <MicOff />}
      </button>

      <button
        onClick={toggleCamera}
        className="p-4 rounded-full bg-slate-800 text-white"
      >
        {cameraOn ? <Video /> : <VideoOff />}
      </button>

      <button
        onClick={toggleScreenShare}
        className={`p-4 rounded-full ${
          isSharing
            ? "bg-blue-600 text-white"
            : "bg-slate-800 text-white"
        }`}
      >
        <MonitorUp />
      </button>

      <button
        onClick={toggleRaiseHand}
        className={`p-4 rounded-full transition-all ${
          myHandRaised ? "bg-violet-600 text-white" : "bg-slate-800 text-white hover:bg-slate-700"
        }`}
        title={myHandRaised ? "Lower Hand" : "Raise Hand"}
      >
        <Hand size={24} className={myHandRaised ? "fill-white text-white" : "text-white"} />
      </button>

      <button
        onClick={leaveMeeting}
        className="bg-red-600 hover:bg-red-700 text-white p-4 rounded-full transition"
      >
        <PhoneOff />
      </button>


      <button
        onClick={toggleChat}
        className="p-4 rounded-full bg-slate-800 text-white"
      >
        <MessageSquare />
      </button>

      <button
        onClick={toggleParticipants}
        className="p-4 rounded-full bg-slate-800 text-white"
      >
        <Users />
      </button>

    </div>
  );
};

export default BottomControls;