import { useState } from "react";

const useScreenShare = () => {
  const [isSharing, setIsSharing] = useState(false);
  const [screenStream, setScreenStream] = useState(null);

  const toggleScreenShare = async () => {
    try {
      if (!isSharing) {
        const stream = await navigator.mediaDevices.getDisplayMedia({
          video: true,
        });

        setScreenStream(stream);
        setIsSharing(true);

        stream.getVideoTracks()[0].onended = () => {
          setScreenStream(null);
          setIsSharing(false);
        };
      } else {
        screenStream?.getTracks().forEach(track => track.stop());

        setScreenStream(null);
        setIsSharing(false);
      }
    } catch (err) {
      console.log(err);
    }
  };

  return {
    isSharing,
    screenStream,
    toggleScreenShare,
  };
};

export default useScreenShare;