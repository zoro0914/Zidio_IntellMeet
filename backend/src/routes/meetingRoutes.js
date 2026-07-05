const express = require("express");

const router = express.Router();

const {
  createMeeting,
  getMeetings,
  getMeetingByLinkOrId,
  cancelMeeting,
  deleteMeeting,
  updateMeeting,
} = require("../controllers/meetingController");

const authMiddleware = require("../middleware/authMiddleware");

router.post(
  "/",
  authMiddleware,
  createMeeting
);

router.get(
  "/",
  authMiddleware,
  getMeetings
);

router.get(
  "/:id",
  authMiddleware,
  getMeetingByLinkOrId
);

router.put(
  "/:id",
  authMiddleware,
  updateMeeting
);

router.put(
  "/:id/cancel",
  authMiddleware,
  cancelMeeting
);

router.delete(
  "/:id",
  authMiddleware,
  deleteMeeting
);

module.exports = router;