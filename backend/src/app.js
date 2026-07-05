const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const cookieParser = require("cookie-parser");
const rateLimit = require("express-rate-limit");
const { ExpressPeerServer } = require("peer"); // ✅ add karo

const errorMiddleware = require("./middleware/errorMiddleware");
const authRoutes = require("./routes/authRoutes");
const meetingRoutes = require("./routes/meetingRoutes");
const aiRoutes = require("./ai/aiRoutes");
const noteRoutes = require("./routes/noteRoutes");
const teamRoutes = require("./routes/teamRoutes");
const adminRoutes = require("./routes/adminRoutes");

const app = express();


// Security
app.use(helmet());

app.use(
  cors({
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
    credentials: true,
  })
);

// Rate Limit
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
});
app.use(limiter);

// Body Parser
app.use(express.json({ limit: "5mb" }));
app.use(express.urlencoded({ extended: true, limit: "5mb" }));

// Cookie Parser
app.use(cookieParser());

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/meetings", meetingRoutes);
app.use("/api/ai", aiRoutes);
app.use("/api/notes", noteRoutes);
app.use("/api/teams", teamRoutes);
app.use("/api/admin", adminRoutes);

// Health
app.get("/health", (req, res) => {
  res.status(200).json({ message: "Server is running" });
});

// ✅ PeerJS ko export karne ke liye function banao
module.exports = (httpServer) => {
  const peerServer = ExpressPeerServer(httpServer, {
    path: "/",
    debug: true,
  });
  app.use("/peerjs", peerServer); // 404 se PEHLE mount ho raha hai

  // 404 (ab sabse last mein)
  app.use((req, res) => {
    res.status(404).json({ message: "Route not found" });
  });

  // Error Middleware
  app.use(errorMiddleware);

  return app;
};