import { useEffect, useRef, useState } from "react";
import {
  Camera,
  Mic,
  Volume2,
  Video,
} from "lucide-react";

const DevicePermission = ({ onJoin }) => {
  const videoRef = useRef(null);

  const [cameras, setCameras] = useState([]);
  const [microphones, setMicrophones] = useState([]);
  const [speakers, setSpeakers] = useState([]);

  const [selectedCamera, setSelectedCamera] = useState("");
  const [selectedMic, setSelectedMic] = useState("");
  const [selectedSpeaker, setSelectedSpeaker] = useState("");

  useEffect(() => {
    getDevices();
  }, []);

  useEffect(() => {
    startPreview();
  }, [selectedCamera, selectedMic]);

  const getDevices = async () => {
    try {
      await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true,
      });

      const devices =
        await navigator.mediaDevices.enumerateDevices();

      const cams = devices.filter(
        (d) => d.kind === "videoinput"
      );

      const mics = devices.filter(
        (d) => d.kind === "audioinput"
      );

      const outputs = devices.filter(
        (d) => d.kind === "audiooutput"
      );

      setCameras(cams);
      setMicrophones(mics);
      setSpeakers(outputs);

      if (cams.length)
        setSelectedCamera(cams[0].deviceId);

      if (mics.length)
        setSelectedMic(mics[0].deviceId);

      if (outputs.length)
        setSelectedSpeaker(outputs[0].deviceId);

    } catch (err) {
      console.log(err);
    }
  };

  const startPreview = async () => {
    if (!selectedCamera && !selectedMic) return;

    const stream =
      await navigator.mediaDevices.getUserMedia({
        video: {
          deviceId: selectedCamera
            ? { exact: selectedCamera }
            : undefined,
        },
        audio: {
          deviceId: selectedMic
            ? { exact: selectedMic }
            : undefined,
        },
      });

    if (videoRef.current) {
      videoRef.current.srcObject = stream;
    }
  };

  return (
    <div className="max-w-6xl mx-auto bg-white rounded-3xl shadow-xl overflow-hidden">

      <div className="grid lg:grid-cols-2">

        {/* Preview */}

        <div className="bg-slate-900 p-6 flex items-center justify-center">

          <video
            ref={videoRef}
            autoPlay
            muted
            playsInline
            className="rounded-2xl w-full"
          />

        </div>

        {/* Device Selection */}

        <div className="p-8 space-y-6">

          <h2 className="text-3xl font-bold">
            Device Setup
          </h2>

          {/* Camera */}

          <div>

            <label className="flex items-center gap-2 font-semibold mb-2">
              <Camera size={18} />
              Camera
            </label>

            <select
              value={selectedCamera}
              onChange={(e) =>
                setSelectedCamera(e.target.value)
              }
              className="w-full border rounded-xl p-3"
            >
              {cameras.map((cam) => (
                <option
                  key={cam.deviceId}
                  value={cam.deviceId}
                >
                  {cam.label}
                </option>
              ))}
            </select>

          </div>

          {/* Microphone */}

          <div>

            <label className="flex items-center gap-2 font-semibold mb-2">
              <Mic size={18} />
              Microphone
            </label>

            <select
              value={selectedMic}
              onChange={(e) =>
                setSelectedMic(e.target.value)
              }
              className="w-full border rounded-xl p-3"
            >
              {microphones.map((mic) => (
                <option
                  key={mic.deviceId}
                  value={mic.deviceId}
                >
                  {mic.label}
                </option>
              ))}
            </select>

          </div>

          {/* Speaker */}

          <div>

            <label className="flex items-center gap-2 font-semibold mb-2">
              <Volume2 size={18} />
              Speaker
            </label>

            <select
              value={selectedSpeaker}
              onChange={(e) =>
                setSelectedSpeaker(e.target.value)
              }
              className="w-full border rounded-xl p-3"
            >
              {speakers.map((sp) => (
                <option
                  key={sp.deviceId}
                  value={sp.deviceId}
                >
                  {sp.label}
                </option>
              ))}
            </select>

          </div>

          <button
            onClick={onJoin}
            className="w-full py-4 rounded-xl bg-violet-600 hover:bg-violet-700 text-white flex items-center justify-center gap-3"
          >
            <Video size={20} />
            Join Meeting
          </button>

        </div>

      </div>

    </div>
  );
};

export default DevicePermission;