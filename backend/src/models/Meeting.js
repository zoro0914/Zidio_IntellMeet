const mongoose = require("mongoose");

const meetingSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },

    description: String,

    meetingDate: {
      type: Date,
      required: true,
    },

    status: {
      type: String,
      enum: ["scheduled", "live", "completed"],
      default: "scheduled",
    },

    meetingLink: {
      type: String,
      required: true,
    },

    videoUrl: {
      type: String,
      default: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4",
    },

    size: {
      type: Number,
      default: 45, // default simulated recording size in MB
    },

    duration: {
      type: String,
      default: "00:45:00",
    },

    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },

    participants: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],

    transcript: {
      type: String,
      default: "",
    },

    summary: {
      type: String,
      default: "",
    },

    actionItems: {
      type: [String],
      default: [],
    },

    keyDecisions: {
      type: [String],
      default: [],
    },

    keywords: {
      type: [String],
      default: [],
    },

    sentiment: {
      type: String,
      default: "",
    },

    highlights: [
      {
        time: String,
        text: String,
      },
    ],

    emailSummary: {
      type: String,
      default: "",
    },

    calendarTasks: [
      {
        title: String,
        dueDate: Date,
      },
    ],
  },
  { timestamps: true }
);

module.exports = mongoose.model(
  "Meeting",
  meetingSchema
);