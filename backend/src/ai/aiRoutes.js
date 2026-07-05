const express = require("express");
const router = express.Router();
const {
  processMeetingAI,
  chatWithMeetingAI,
  searchMeetingsAI,
  generateEmailSummary,
  generateAnalyticsInsightsAI,
} = require("./aiController");
const authMiddleware = require("../middleware/authMiddleware");

// AI endpoints
router.post("/process/:id", authMiddleware, processMeetingAI);
router.post("/chat", authMiddleware, chatWithMeetingAI);
router.get("/search", authMiddleware, searchMeetingsAI);
router.get("/email/:id", authMiddleware, generateEmailSummary);
router.post("/analytics-insights", authMiddleware, generateAnalyticsInsightsAI);

module.exports = router;
