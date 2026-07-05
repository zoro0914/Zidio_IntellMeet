import { useEffect, useRef } from "react";
import {
  Mic,
  MicOff,
  CameraOff,
} from "lucide-react";

const VideoCard = ({
  stream,
  name = "Participant",
  micOn = true,
  cameraOn = true,
  isHost = false,
  raisedHand = false,
}) => {

  const videoRef = useRef(null);

  useEffect(() => {

    if (!videoRef.current || !stream) return;

    videoRef.current.srcObject = stream;

    videoRef.current.onloadedmetadata = () => {
      videoRef.current
        .play()
        .catch((err) => console.log(err));
    };

  }, [stream]);

  const hasVideo =
    stream &&
    stream.getVideoTracks().length > 0 &&
    cameraOn;

  return (
    <div className={`relative rounded-2xl overflow-hidden bg-slate-900 border h-full transition-all duration-300 ${isHost ? "border-violet-500 shadow-lg shadow-violet-500/20 ring-2 ring-violet-500/30" : "border-slate-700"
      }`}>

      <video
        ref={videoRef}
        autoPlay
        playsInline
        muted={name === "You"}
        className={`w-full h-full object-cover ${hasVideo ? "" : "hidden"}`}
      />

      {!hasVideo && (
        <div className="w-full h-full flex flex-col justify-center items-center text-white">
          <CameraOff size={60} />
          <p className="mt-4 text-lg">
            Camera Off
          </p>
        </div>
      )}

      {raisedHand && (
        <div className="absolute top-4 right-4 bg-violet-600 text-white p-2.5 rounded-full shadow-lg shadow-violet-600/30 animate-bounce flex items-center justify-center z-10 border border-violet-400">
          <span className="text-xl">✋</span>
        </div>
      )}

      <div className="absolute bottom-0 left-0 right-0 bg-black/50 backdrop-blur-sm px-4 py-3 flex justify-between items-center text-white z-10">

        <div className="flex items-center gap-2">
          <span>{name}</span>
          {isHost && (
            <span className="px-1.5 py-0.5 text-[9px] font-bold bg-violet-600 text-white rounded uppercase tracking-wider">
              Host
            </span>
          )}
        </div>

        {micOn ? (
          <Mic size={18} />
        ) : (
          <MicOff
            size={18}
            className="text-red-500"
          />
        )}

      </div>

    </div>
  );
};

export default VideoCard;