import { useState } from "react";

const useMicrophone = () => {
  const [micOn, setMicOn] = useState(false);
  const [audioStream, setAudioStream] = useState(null);

  const toggleMic = async () => {
    try {
      if (!micOn) {
        const media = await navigator.mediaDevices.getUserMedia({
          audio: true,
        });

        setAudioStream(media);
        setMicOn(true);
      } else {
        audioStream?.getAudioTracks().forEach(track => track.stop());

        setAudioStream(null);
        setMicOn(false);
      }
    } catch (err) {
      console.log(err);
      alert("Microphone permission denied.");
    }
  };

  return {
    micOn,
    toggleMic,
  };
};

export default useMicrophone;