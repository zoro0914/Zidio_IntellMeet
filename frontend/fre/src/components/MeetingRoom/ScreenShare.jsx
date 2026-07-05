import { useEffect, useRef } from "react";
import {
  ScreenShare as ScreenIcon,
  Monitor,
} from "lucide-react";

const ScreenShare = ({
  isSharing,
  screenStream,
  sharedBy = "You",
}) => {

  const videoRef = useRef(null);

  useEffect(() => {
    if (videoRef.current && screenStream) {
      videoRef.current.srcObject = screenStream;
    }
  }, [screenStream]);

  if (!isSharing) return null;

  return (
    <div className="w-full h-full bg-slate-950 rounded-2xl overflow-hidden relative border border-slate-700">

      {screenStream ? (
        <video
          ref={videoRef}
          autoPlay
          playsInline
          muted
          className="w-full h-full object-contain bg-black"
        />
      ) : (
        <div className="w-full h-full flex flex-col items-center justify-center text-white">

          <Monitor
            size={90}
            className="text-violet-500 mb-6"
          />

          <h2 className="text-2xl font-bold">
            Screen Sharing
          </h2>

          <p className="text-slate-400 mt-2">
            Waiting for shared screen...
          </p>

        </div>
      )}

      <div className="absolute top-5 left-5 bg-violet-600 text-white px-4 py-2 rounded-xl flex items-center gap-2 shadow-lg">

        <ScreenIcon size={18} />

        <span className="font-medium">
          {sharedBy} is presenting
        </span>

      </div>

      <div className="absolute bottom-5 right-5 bg-black/60 backdrop-blur-md px-4 py-2 rounded-xl text-sm text-white">
        Live Screen Share
      </div>

    </div>
  );
};

export default ScreenShare;