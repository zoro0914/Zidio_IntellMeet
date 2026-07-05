require("dotenv").config();

const http = require("http");
const { Server } = require("socket.io");
const createApp = require("./app"); // ✅ ab function import ho raha hai
const connectDB = require("./config/db");

const PORT = process.env.PORT || 5000;

connectDB();

// pehle ek dummy/empty httpServer banao app ke bina
const httpServer = http.createServer();
const app = createApp(httpServer); // ✅ app ko httpServer pass karo
httpServer.on("request", app); // ✅ ab app ko request handler bana do

const io = new Server(httpServer, {
  cors: {
    origin: (origin, callback) => {
      if (!origin) return callback(null, true);
      const allowedPatterns = [
        /^http:\/\/localhost(:\d+)?$/,
        /^http:\/\/127\.0\.0\.1(:\d+)?$/,
        /^http:\/\/192\.168\.\d+\.\d+(:\d+)?$/,
      ];
      const allowedOrigins = [
        process.env.CLIENT_URL,
        process.env.ADMIN_URL,
      ].filter(Boolean);

      const isAllowed = allowedPatterns.some((pattern) => pattern.test(origin)) ||
                        allowedOrigins.includes(origin);
      if (isAllowed) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    methods: ["GET", "POST"],
    credentials: true,
  },
});

require("./socket/Socket")(io);

httpServer.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT}`);
});

process.on("unhandledRejection", (err) => {
  console.error(err);
  httpServer.close(() => process.exit(1));
});

process.on("uncaughtException", (err) => {
  console.error(err);
  process.exit(1);
});