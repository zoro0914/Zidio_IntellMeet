const express = require("express");
const router = express.Router();

const {
  createNote,
  getNotes,
  updateNote,
  deleteNote,
  generateNoteWithAI,
} = require("../controllers/noteController");

const authMiddleware = require("../middleware/authMiddleware");

// All notes endpoints require authentication
router.use(authMiddleware);

router.post("/", createNote);
router.get("/", getNotes);
router.put("/:id", updateNote);
router.delete("/:id", deleteNote);
router.post("/generate/:meetingId", generateNoteWithAI);

module.exports = router;
