const Meeting = require("../models/Meeting");
const gemini = require("./gemini");
const whisper = require("./whisper");

// ----------------------------------------------------
// 1. Process Meeting Audio / Text with AI Pipeline
// ----------------------------------------------------
const processMeetingAI = async (req, res) => {
  try {
    const { id } = req.params;
    const { audioPath, manualTranscript } = req.body;

    const meeting = await Meeting.findById(id);
    if (!meeting) {
      return res.status(404).json({
        success: false,
        message: "Meeting not found"
      });
    }

    // Phase 1: Transcribe Audio or use manual text
    let transcriptText = "";
    if (audioPath) {
      // Mock passing stream or filepath to Whisper
      transcriptText = await whisper.transcribeAudio(audioPath, meeting);
    } else if (manualTranscript) {
      transcriptText = manualTranscript;
    } else {
      // Use fallback default transcript
      transcriptText = await whisper.transcribeAudio(null, meeting);
    }

    // Phase 2: Generate Gemini Insights
    const summary = await gemini.generateSummary(transcriptText);
    const actionItems = await gemini.generateActionItems(transcriptText);
    const keyDecisions = await gemini.generateKeyDecisions(transcriptText);
    const keywords = await gemini.generateKeywords(transcriptText);
    const sentiment = await gemini.generateSentiment(transcriptText);
    const calendarTasks = await gemini.generateCalendarTasks(transcriptText);

    // Mock highlights parsing based on timestamps in transcript
    const highlights = [];
    const transcriptLines = transcriptText.split("\n");
    for (const line of transcriptLines) {
      const match = line.match(/^(\d{2}:\d{2})\s+([\w\s]+):\s*(.*)$/);
      if (match) {
        const time = match[1];
        const speaker = match[2];
        const text = match[3];
        // Capture important action or summary keywords as highlights
        if (text.toLowerCase().includes("fix") || text.toLowerCase().includes("agree") || text.toLowerCase().includes("test") || text.toLowerCase().includes("perfect")) {
          highlights.push({ time, text: `${speaker}: ${text}` });
        }
      }
    }

    // Mock Email Summary Generation
    const emailSummary = `Subject: Meeting Summary - ${meeting.title}\n\n` +
      `Dear Team,\n\n` +
      `Here is the summary and action items from the meeting "${meeting.title}" held on ${new Date(meeting.meetingDate).toLocaleDateString()}:\n\n` +
      `Summary:\n${summary}\n\n` +
      `Key Decisions:\n${keyDecisions.map(d => `- ${d}`).join("\n")}\n\n` +
      `Action Items:\n${actionItems.map(a => `- ${a}`).join("\n")}\n\n` +
      `Best Regards,\nMeeting AI Assistant`;

    // Save to Database
    meeting.status = "completed";
    meeting.transcript = transcriptText;
    meeting.summary = summary;
    meeting.actionItems = actionItems;
    meeting.keyDecisions = keyDecisions;
    meeting.keywords = keywords;
    meeting.sentiment = sentiment;
    meeting.highlights = highlights;
    meeting.emailSummary = emailSummary;
    meeting.calendarTasks = calendarTasks;

    await meeting.save();

    res.status(200).json({
      success: true,
      message: "AI analysis completed and saved successfully!",
      meeting
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// ----------------------------------------------------
// 2. Chat with Meeting AI Assistant
// ----------------------------------------------------
const chatWithMeetingAI = async (req, res) => {
  try {
    const { meetingId, chatHistory, userMessage } = req.body;

    let meeting;
    if (meetingId === "global") {
      meeting = {
        title: "Global Workspace",
        host: "AI Assistant",
        summary: "IntellMeet is an AI Collaboration Platform that integrates WebRTC video rooms, persistent group channels, task management notes, and calendars.",
        actionItems: [
          "Check recordings to review AI transcripts",
          "Ask questions in the AI Chat sidebar to resolve details",
          "Schedule upcoming events on the calendar page"
        ],
        keyDecisions: [
          "Adopted Gemini models for automated meeting transcript summarization"
        ]
      };
    } else if (typeof meetingId === "string" && meetingId.startsWith("mock-")) {
      const mock1 = {
        title: "AI Features & Socket Integration Sync",
        host: "Sania Malhotra",
        summary: "The meeting focused on the migration of peer signaling interfaces and fixing CORS origin blockers.",
        actionItems: [
          "Harsh - Configure dynamic CORS allowed origins on production",
          "Sania - Verify camera and microphone fallbacks inside standard tabs",
          "Laxmi - Wrap sidebar menu lists inside scrollable viewport containers"
        ],
        keyDecisions: [
          "Agreed to dynamically bind frontend connection URLs to current window hostname"
        ],
        transcript: "00:02 Sania: Welcome everyone to our engineering sync. Let's look at the WebRTC setup.\n00:10 Harsh: Yes, I successfully tested peer connections across different browsers.\n00:20 Sania: Perfect! Did you run into any CORS problems?\n00:28 Harsh: Yes, but we fixed it completely by dynamically matching hostnames."
      };

      const mock2 = {
        title: "UI Layout & Responsive Sidebar Design",
        host: "Laxmi Prasad",
        summary: "Sidebar links container updated to scroll internally, preventing item cutoffs on low screen heights.",
        actionItems: [
          "Laxmi - Wrap sidebar link lists in a scrollable flex layout",
          "Sania - Verify responsiveness of grid layout items in small screens"
        ],
        keyDecisions: [
          "Decided to replace scrollable viewport settings with a locked viewport framework"
        ],
        transcript: "00:01 Laxmi: Hey Sania, let's review the sidebar layout.\n00:12 Sania: The top menu links are getting cut off when height is constrained.\n00:22 Laxmi: I will wrap the links in a scrollable div and make the footer static."
      };

      meeting = meetingId === "mock-1" ? mock1 : mock2;
    } else {
      meeting = await Meeting.findById(meetingId);
    }

    if (!meeting) {
      return res.status(404).json({
        success: false,
        message: "Meeting not found"
      });
    }

    const aiResponse = await gemini.aiChat(meeting, chatHistory || [], userMessage);

    res.status(200).json({
      success: true,
      response: aiResponse
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// ----------------------------------------------------
// 3. Smart Semantic Search
// ----------------------------------------------------
const searchMeetingsAI = async (req, res) => {
  try {
    const { q } = req.query;
    if (!q) {
      return res.status(400).json({
        success: false,
        message: "Search query 'q' is required"
      });
    }

    // Retrieve all meetings belonging to user (or all meetings in simple setup)
    const meetings = await Meeting.find().populate("createdBy", "name email");

    const matchedIds = await gemini.semanticSearchMatches(q, meetings);

    // Filter meetings list by matched IDs
    const matchedMeetings = meetings.filter(m => matchedIds.includes(m._id.toString()) || matchedIds.includes(m.id));

    res.status(200).json({
      success: true,
      meetings: matchedMeetings
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// ----------------------------------------------------
// 4. Generate Sharing Email Copy
// ----------------------------------------------------
const generateEmailSummary = async (req, res) => {
  try {
    const { id } = req.params;

    const meeting = await Meeting.findById(id);
    if (!meeting) {
      return res.status(404).json({
        success: false,
        message: "Meeting not found"
      });
    }

    if (!meeting.summary) {
      return res.status(400).json({
        success: false,
        message: "Meeting has not been processed by AI. Please run process endpoint first."
      });
    }

    res.status(200).json({
      success: true,
      emailSubject: `Meeting Summary: ${meeting.title}`,
      emailBody: meeting.emailSummary
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// 5. Generate AI Analytics Insights
const generateAnalyticsInsightsAI = async (req, res) => {
  try {
    const { stats, sentiments, keywords } = req.body;
    
    // Call Gemini helper
    const insights = await gemini.generateAnalyticsInsights(stats, sentiments, keywords);

    res.status(200).json({
      success: true,
      insights,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = {
  processMeetingAI,
  chatWithMeetingAI,
  searchMeetingsAI,
  generateEmailSummary,
  generateAnalyticsInsightsAI,
};
