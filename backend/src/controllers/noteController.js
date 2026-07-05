const Note = require("../models/Note");
const Meeting = require("../models/Meeting");
const gemini = require("../ai/gemini");

// 1. Create a manual Note
const createNote = async (req, res) => {
  try {
    const { title, body, meetingId } = req.body;

    const note = await Note.create({
      title,
      body,
      meetingId,
      createdBy: req.user.userId,
    });

    res.status(201).json({
      success: true,
      note,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// 2. Get Notes (optionally filter by meetingId)
const getNotes = async (req, res) => {
  try {
    const { meetingId } = req.query;
    let query = {};

    if (meetingId) {
      query.meetingId = meetingId;
    }

    const notes = await Note.find(query)
      .populate("meetingId", "title")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      notes,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// 3. Update an existing Note
const updateNote = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, body } = req.body;

    const note = await Note.findByIdAndUpdate(
      id,
      { title, body },
      { new: true }
    );

    if (!note) {
      return res.status(404).json({
        success: false,
        message: "Note not found",
      });
    }

    res.status(200).json({
      success: true,
      note,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// 4. Delete Note
const deleteNote = async (req, res) => {
  try {
    const { id } = req.params;
    const note = await Note.findByIdAndDelete(id);

    if (!note) {
      return res.status(404).json({
        success: false,
        message: "Note not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Note deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// 5. Generate AI note using Gemini
const generateNoteWithAI = async (req, res) => {
  try {
    const { meetingId } = req.params;

    const meeting = await Meeting.findById(meetingId);
    if (!meeting) {
      return res.status(404).json({
        success: false,
        message: "Meeting not found",
      });
    }

    // Call Gemini utility
    const noteText = await gemini.generateAINote(meeting);

    // Save as a new Note
    const aiNote = await Note.create({
      title: `[AI Note] - ${meeting.title}`,
      body: noteText,
      meetingId: meeting._id,
      createdBy: req.user.userId,
    });

    res.status(201).json({
      success: true,
      note: aiNote,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = {
  createNote,
  getNotes,
  updateNote,
  deleteNote,
  generateNoteWithAI,
};
