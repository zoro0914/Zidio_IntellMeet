import { useState, useEffect } from "react";
import { X, Video } from "lucide-react";
import { useNavigate } from "react-router-dom";

const JoinMeetingModal = ({ open, onClose, prefillId = "" }) => {
  const navigate = useNavigate();

  const [roomId, setRoomId] = useState("");

  useEffect(() => {
    if (open) {
      let cleanId = prefillId || "";
      if (cleanId.includes("/")) {
        const parts = cleanId.split("/");
        cleanId = parts[parts.length - 1];
      }
      cleanId = cleanId.replace(/[^a-zA-Z0-9-]/g, "");
      setRoomId(cleanId);
    }
  }, [open, prefillId]);

  const handleJoin = () => {
    const rawId = roomId.trim();
    if (!rawId) return;

    let cleanId = rawId;
    if (cleanId.includes("/")) {
      const parts = cleanId.split("/");
      cleanId = parts[parts.length - 1];
    }
    // Remove all non-alphanumeric characters
    cleanId = cleanId.replace(/[^a-zA-Z0-9]/g, "").toLowerCase();

    // Format 9-character code to xxx-xxx-xxx format
    if (cleanId.length === 9) {
      cleanId = `${cleanId.slice(0, 3)}-${cleanId.slice(3, 6)}-${cleanId.slice(6, 9)}`;
    }

    navigate(`/meeting/${cleanId}`);
    onClose();
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 px-4">

      <div className="bg-white rounded-2xl w-full max-w-md shadow-xl">

        <div className="flex items-center justify-between p-6 border-b">

          <div>
            <h2 className="text-2xl font-bold">
              Join Meeting
            </h2>

            <p className="text-gray-500 text-sm">
              Enter Meeting ID
            </p>
          </div>

          <button onClick={onClose}>
            <X />
          </button>

        </div>

        <div className="p-6">

          <input
            type="text"
            placeholder="Enter meeting code/id"
            value={roomId}
            onChange={(e) => setRoomId(e.target.value)}
            className="w-full border rounded-xl p-3 outline-none focus:ring-2 focus:ring-violet-500"
          />

          <button
            onClick={handleJoin}
            className="mt-5 w-full bg-violet-600 hover:bg-violet-700 text-white rounded-xl py-3 flex justify-center items-center gap-2 font-bold transition-colors cursor-pointer"
          >
            <Video size={20} />
            Join Meeting
          </button>

        </div>

      </div>

    </div>
  );
};

export default JoinMeetingModal;