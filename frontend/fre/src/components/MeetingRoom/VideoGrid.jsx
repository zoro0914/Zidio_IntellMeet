import VideoCard from "./VideoCard";
import peer from "../../Utils/peer";

const VideoGrid = ({
  stream,
  remoteStreams = [],
  participants = [],
  micOn,
  cameraOn,
  hostId,
  myHandRaised,
}) => {

  const localUser = JSON.parse(localStorage.getItem("user")) || {};
  const localUserId = localUser.id || localUser._id;
  const isLocalHost = localUserId === hostId;

  // Local user ko remove karo
  const remoteParticipants = participants.filter(
    (p) => p.peerId !== peer.id
  );

  const totalParticipants = remoteParticipants.length + 1;

  let gridClass = "grid-cols-1";

  if (totalParticipants === 1) {
    gridClass = "grid-cols-1";
  } else if (totalParticipants <= 4) {
    gridClass = "grid-cols-2";
  } else if (totalParticipants <= 9) {
    gridClass = "grid-cols-3";
  } else {
    gridClass = "grid-cols-4";
  }

  console.log("Peer ID:", peer.id);
console.log("Participants:", participants);
console.log("Remote Streams:", remoteStreams);
console.log(remoteStreams);
console.log(
  remoteStreams[0]?.stream?.getVideoTracks()
);
  return (
    <div className={`grid ${gridClass} gap-5 h-full auto-rows-fr`}>

      {/* Local User */}

      <VideoCard
        stream={stream}
        name="You"
        micOn={micOn}
        cameraOn={cameraOn}
        isHost={isLocalHost}
        raisedHand={myHandRaised}
      />

      {/* Remote Users */}

      {remoteParticipants.map((participant) => {
        const isRemoteHost = participant.userId === hostId;

        const remote = remoteStreams.find(
          (r) => r.peerId === participant.peerId
        );

        return (
          <VideoCard
            key={participant.peerId}
            stream={remote?.stream || null}
            name={participant.name}
            micOn={true}
            cameraOn={!!remote?.stream}
            isHost={isRemoteHost}
            raisedHand={participant.raisedHand}
          />
        );

      })}

    </div>
  );
};

export default VideoGrid;