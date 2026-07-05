const express = require("express");
const router = express.Router();

const {
  getStats,
  getUsers,
  updateUserRole,
  deleteUser,
  getMeetings,
  deleteMeeting,
  createUser,
  updateUser,
  getAnalytics
} = require("../controllers/adminController");

const authMiddleware = require("../middleware/authMiddleware");
const adminMiddleware = require("../middleware/adminMiddleware");

// Guard all routes under authentication and admin filters
router.use(authMiddleware);
router.use(adminMiddleware);

router.get("/stats", getStats);
router.get("/users", getUsers);
router.post("/users", createUser);
router.put("/users/:userId", updateUser);
router.put("/users/:userId/role", updateUserRole);
router.delete("/users/:userId", deleteUser);
router.get("/meetings", getMeetings);
router.delete("/meetings/:meetingId", deleteMeeting);
router.get("/analytics", getAnalytics);

module.exports = router;
