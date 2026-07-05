import { useState, useEffect, useRef, useCallback } from "react";

const createDummyStream = () => {
  try {
    const canvas = document.createElement("canvas");
    canvas.width = 640;
    canvas.height = 480;
    const ctx = canvas.getContext("2d");
    ctx.fillStyle = "#0f172a"; // Slate-900 background
    ctx.fillRect(0, 0, 640, 480);
    
    const captureFn = canvas.captureStream || canvas.webkitCaptureStream;
    if (captureFn) {
      const stream = captureFn.call(canvas, 10);
      try {
        const audioContext = new (window.AudioContext || window.webkitAudioContext)();
        const oscillator = audioContext.createOscillator();
        const dst = audioContext.createMediaStreamDestination();
        oscillator.connect(dst);
        const gainNode = audioContext.createGain();
        gainNode.gain.value = 0;
        oscillator.connect(gainNode);
        gainNode.connect(dst);
        oscillator.start();
        const audioTrack = dst.stream.getAudioTracks()[0];
        if (audioTrack) stream.addTrack(audioTrack);
      } catch (e) {
        console.error("Failed to create dummy audio track", e);
      }
      return stream;
    }
  } catch (err) {
    console.error("Failed to create dummy stream", err);
  }
  return new MediaStream(); // Return empty stream as fallback
};

const useMedia = () => {
  const [stream, setStream] = useState(null);
  const [cameraOn, setCameraOn] = useState(true);
  const [micOn, setMicOn] = useState(true);
  const [loading, setLoading] = useState(true);
  const streamRef = useRef(null);

  useEffect(() => {
    let active = true;

    const initMedia = async () => {
      try {
        const mediaStream = await navigator.mediaDevices.getUserMedia({
          video: {
            width: { ideal: 640 },
            height: { ideal: 480 },
            facingMode: "user"
          },
          audio: true,
        });

        if (!active) {
          mediaStream.getTracks().forEach((track) => track.stop());
          return;
        }

        streamRef.current = mediaStream;
        setStream(mediaStream);
        setCameraOn(true);
        setMicOn(true);
      } catch (err) {
        console.warn("Could not acquire media devices with audio/video. Trying fallback...", err);
        
        // Try audio-only or video-only or dummy fallback
        try {
          const audioOnly = await navigator.mediaDevices.getUserMedia({ video: false, audio: true });
          if (!active) {
            audioOnly.getTracks().forEach((track) => track.stop());
            return;
          }
          // Merge audio only with dummy video
          const dummyVideo = createDummyStream().getVideoTracks()[0];
          audioOnly.addTrack(dummyVideo);
          streamRef.current = audioOnly;
          setStream(audioOnly);
          setCameraOn(false);
          setMicOn(true);
        } catch (err2) {
          try {
            const videoOnly = await navigator.mediaDevices.getUserMedia({ video: true, audio: false });
            if (!active) {
              videoOnly.getTracks().forEach((track) => track.stop());
              return;
            }
            // Merge video only with dummy audio
            const dummyAudio = createDummyStream().getAudioTracks()[0];
            if (dummyAudio) videoOnly.addTrack(dummyAudio);
            streamRef.current = videoOnly;
            setStream(videoOnly);
            setCameraOn(true);
            setMicOn(false);
          } catch (err3) {
            console.error("All media device access failed. Using dummy fallback stream.", err3);
            if (!active) return;
            const dummy = createDummyStream();
            streamRef.current = dummy;
            setStream(dummy);
            setCameraOn(false);
            setMicOn(false);
          }
        }
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    };

    initMedia();

    return () => {
      active = false;
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((track) => track.stop());
      }
    };
  }, []);

  const toggleCamera = useCallback(() => {
    if (!streamRef.current) return;
    const videoTrack = streamRef.current.getVideoTracks()[0];
    if (videoTrack) {
      videoTrack.enabled = !videoTrack.enabled;
      setCameraOn(videoTrack.enabled);
    }
  }, []);

  const toggleMic = useCallback(() => {
    if (!streamRef.current) return;
    const audioTrack = streamRef.current.getAudioTracks()[0];
    if (audioTrack) {
      audioTrack.enabled = !audioTrack.enabled;
      setMicOn(audioTrack.enabled);
    }
  }, []);

  return {
    stream,
    cameraOn,
    micOn,
    loading,
    toggleCamera,
    toggleMic,
  };
};

export default useMedia;
