import { useState } from "react";

const useCamera = () => {
  const [cameraOn, setCameraOn] = useState(false);
  const [stream, setStream] = useState(null);

  const toggleCamera = async () => {
    try {
      if (!cameraOn) {
        const media = await navigator.mediaDevices.getUserMedia({
          video: true,
          audio: false,
        });

        setStream(media);
        setCameraOn(true);
      } else {
        stream?.getTracks().forEach((track) => track.stop());

        setStream(null);
        setCameraOn(false);
      }
    } catch (err) {
      console.error(err);
      alert("Camera permission denied.");
    }
  };

  return {
    cameraOn,
    stream,
    toggleCamera,
    setStream, // 👈 important
  };
};

export default useCamera;