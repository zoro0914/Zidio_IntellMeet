import Peer from "peerjs";

const getPeerConfig = () => {
  const socketUrl = import.meta.env.VITE_SOCKET_URL || (import.meta.env.VITE_API_URL ? import.meta.env.VITE_API_URL.replace(/\/api$/, '') : null);
  
  if (socketUrl) {
    try {
      const url = new URL(socketUrl);
      return {
        host: url.hostname,
        port: url.port ? Number(url.port) : (url.protocol === "https:" ? 443 : 80),
        path: "/peerjs",
        secure: url.protocol === "https:",
      };
    } catch (e) {
      console.error("Failed to parse URL for PeerJS:", e);
    }
  }

  // Fallback to local defaults
  return {
    host: window.location.hostname,
    port: 5000,
    path: "/peerjs",
    secure: window.location.protocol === "https:",
  };
};

const peer = new Peer(undefined, getPeerConfig());

export default peer;