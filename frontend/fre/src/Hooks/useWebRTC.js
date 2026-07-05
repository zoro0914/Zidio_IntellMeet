import { useEffect, useRef, useState, useCallback } from "react";
import peer from "../Utils/peer";
import socket from "../Utils/socket";

const createDummyStream = () => {
  try {
    const canvas = document.createElement("canvas");
    canvas.width = 2;
    canvas.height = 2;

    const ctx = canvas.getContext("2d");
    ctx.fillStyle = "black";
    ctx.fillRect(0, 0, 2, 2);

    const captureFn = canvas.captureStream || canvas.webkitCaptureStream;
    if (captureFn) {
      return captureFn.call(canvas, 1);
    }
  } catch (err) {
    console.error("Failed to create dummy stream in useWebRTC", err);
  }
  return new MediaStream();
};

const useWebRTC = (roomId) => {
  const [remoteStreams, setRemoteStreams] = useState([]);

  const localStreamRef = useRef(null);
  const callsRef = useRef({});

  // -------------------------------
  // Update Local Stream
  // -------------------------------

  const updateStream = useCallback((stream) => {
    localStreamRef.current = stream;

    Object.values(callsRef.current).forEach((call) => {
      const sender = call.peerConnection
        ?.getSenders()
        ?.find((s) => s.track?.kind === "video");

      if (!sender) return;

      const track = stream
        ? stream.getVideoTracks()[0]
        : createDummyStream().getVideoTracks()[0];

      sender.replaceTrack(track);
    });
  }, []);

  // -------------------------------
  // Helper function
  // -------------------------------

  const connectToPeer = useCallback((peerId) => {
    if (!peerId) return;

    if (peerId === peer.id) return;

    if (callsRef.current[peerId]) return;

    console.log("📞 Calling:", peerId);

    try {
      const call = peer.call(
        peerId,
        localStreamRef.current || createDummyStream(),
      );

      callsRef.current[peerId] = call;

      call.on("stream", (remoteStream) => {
        console.log("🎥 Stream Received:", peerId);

        setRemoteStreams((prev) => {
          const exists = prev.find((p) => p.peerId === peerId);

          if (exists) {
            return prev.map((p) =>
              p.peerId === peerId
                ? {
                    ...p,
                    stream: remoteStream,
                  }
                : p,
            );
          }

          return [
            ...prev,
            {
              peerId,
              stream: remoteStream,
            },
          ];
        });
      });

      call.on("close", () => {
        delete callsRef.current[peerId];

        setRemoteStreams((prev) => prev.filter((p) => p.peerId !== peerId));
      });
    } catch (err) {
      console.error("Failed to establish peer call:", err);
    }
  }, []);

  // -------------------------------
  // Incoming Calls
  // -------------------------------

  useEffect(() => {
    const handleCall = (call) => {
      console.log("📞 Incoming:", call.peer);

      callsRef.current[call.peer] = call;

      try {
        call.answer(localStreamRef.current || createDummyStream());

        call.on("stream", (remoteStream) => {
          console.log("🎥 Remote:", call.peer);

          setRemoteStreams((prev) => {
            const exists = prev.find((p) => p.peerId === call.peer);

            if (exists) {
              return prev.map((p) =>
                p.peerId === call.peer
                  ? {
                      ...p,
                      stream: remoteStream,
                    }
                  : p,
              );
            }

            return [
              ...prev,
              {
                peerId: call.peer,
                stream: remoteStream,
              },
            ];
          });
        });

        call.on("close", () => {
          delete callsRef.current[call.peer];

          setRemoteStreams((prev) => prev.filter((p) => p.peerId !== call.peer));
        });
      } catch (err) {
        console.error("Failed to answer peer call:", err);
      }
    };

    peer.on("call", handleCall);

    return () => {
      peer.off("call", handleCall);
    };
  }, []);

  // -------------------------------
  // Existing Users
  // -------------------------------

  useEffect(() => {
    const handleExistingUsers = (users) => {
      console.log("👥 Existing Users:", users);

      users.forEach((user) => {
        connectToPeer(user.peerId);
      });
    };

    socket.on("existing-users", handleExistingUsers);

    return () => {
      socket.off("existing-users", handleExistingUsers);
    };
  }, [connectToPeer]);

  // -------------------------------
  // New User Joined
  // -------------------------------

  useEffect(() => {
    const handleUserConnected = (peerId) => {
      console.log("👤 User Joined:", peerId);
      // We do not call connectToPeer here. The joining user will call us.
    };

    socket.on("user-connected", handleUserConnected);

    return () => {
      socket.off("user-connected", handleUserConnected);
    };
  }, []);

  // -------------------------------
  // User Left
  // -------------------------------

  useEffect(() => {
    const handleUserDisconnected = (peerId) => {
      console.log("❌ Left:", peerId);

      if (callsRef.current[peerId]) {
        callsRef.current[peerId].close();

        delete callsRef.current[peerId];
      }

      setRemoteStreams((prev) => prev.filter((p) => p.peerId !== peerId));
    };

    socket.on("user-disconnected", handleUserDisconnected);

    return () => {
      socket.off("user-disconnected", handleUserDisconnected);
    };
  }, []);

  // -------------------------------
  // Cleanup
  // -------------------------------

  useEffect(() => {
    return () => {
      Object.values(callsRef.current).forEach((call) => call.close());

      callsRef.current = {};

      setRemoteStreams([]);
    };
  }, []);

  return {
    remoteStreams,
    updateStream,
  };
};

export default useWebRTC;
