const express = require("express");
const router = express.Router();
const teamController = require("../controllers/teamController");
const authMiddleware = require("../middleware/authMiddleware");

// All routes are protected
router.use(authMiddleware);

router.post("/", teamController.createTeam);
router.get("/", teamController.getTeams);
router.post("/:teamId/members", teamController.addMember);
router.get("/:teamId/messages", teamController.getTeamMessages);
router.delete("/:teamId/members/:memberId", teamController.removeMember);

module.exports = router;
