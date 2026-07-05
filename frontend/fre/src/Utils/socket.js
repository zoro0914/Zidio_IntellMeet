import { io } from "socket.io-client";

const socketUrl = import.meta.env.VITE_SOCKET_URL || (import.meta.env.VITE_API_URL ? import.meta.env.VITE_API_URL.replace(/\/api$/, '') : `${window.location.protocol}//${window.location.hostname}:5000`);
const socket = io(socketUrl, {
  withCredentials: true,
});
socket.on("connect", () => {
  console.log("✅ Connected:", socket.id);
});

socket.on("connect_error", (err) => {
  console.error("❌ Connection error:", err.message);
}); 

export default socket;