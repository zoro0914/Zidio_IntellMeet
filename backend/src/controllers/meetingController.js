const Meeting = require("../models/Meeting");
const User = require("../models/User");
const sendEmail = require("../utils/sendEmail");

// Create Meeting
const createMeeting = async (req, res) => {
  try {
    const {
      title,
      description,
      meetingDate,
      meetingLink,
      inviteEmails,
    } = req.body;

    const meeting = await Meeting.create({
      title,
      description,
      meetingDate,
      meetingLink,
      createdBy: req.user.userId,
    });

    let emailSent = false;
    let emailError = null;

    try {
      let creator = await User.findById(req.user.userId);
      if (!creator) {
        const Admin = require("../models/Admin");
        creator = await Admin.findById(req.user.userId);
      }
      const hostName = creator ? creator.name : "An IntellMeet Host";

      const recipients = new Set();
      if (creator && creator.email) {
        recipients.add(creator.email.toLowerCase().trim());
      }
      if (Array.isArray(inviteEmails)) {
        inviteEmails.forEach(email => {
          if (email && email.includes("@")) {
            recipients.add(email.toLowerCase().trim());
          }
        });
      }

      if (recipients.size > 0) {
        const formattedDate = new Date(meetingDate).toLocaleString('en-US', {
          weekday: 'long',
          year: 'numeric',
          month: 'long',
          day: 'numeric',
          hour: '2-digit',
          minute: '2-digit',
          timeZoneName: 'short'
        });

        const subject = `📅 Invited to Meeting: ${title}`;
        const html = `
          <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e2e8f0; border-radius: 12px; background-color: #fafafa;">
            <h2 style="color: #6d28d9; margin-top: 0;">IntellMeet Schedule Notification</h2>
            <p>Hello,</p>
            <p>You have been invited to a scheduled conference call hosted by <strong>${hostName}</strong>.</p>
            
            <div style="background-color: #ffffff; padding: 15px; border-radius: 8px; border: 1px solid #e2e8f0; margin: 20px 0;">
              <h3 style="margin-top: 0; color: #1e293b;">${title}</h3>
              <p style="margin: 5px 0;"><strong>Date & Time:</strong> ${formattedDate}</p>
              <p style="margin: 5px 0;"><strong>Meeting Code/Link:</strong> <a href="${meetingLink}" style="color: #4f46e5; text-decoration: underline;">${meetingLink}</a></p>
              ${description ? `<p style="margin: 10px 0 0 0; color: #64748b; font-style: italic;">"${description}"</p>` : ''}
            </div>
            
            <p style="font-size: 12px; color: #94a3b8; margin-top: 30px;">This is an automated notification from IntellMeet. Please make sure to add it to your calendar.</p>
          </div>
        `;

        for (const email of recipients) {
          await sendEmail(email, subject, html);
        }
        emailSent = true;
      }
    } catch (mailErr) {
      console.error("Failed to send meeting notification emails:", mailErr.message);
      emailError = mailErr.message;
    }

    res.status(201).json({
      success: true,
      meeting,
      emailSent,
      emailError
    });
  } catch (error) {
    console.error("Error in createMeeting:", error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Get All Meetings
const getMeetings = async (req, res) => {
  try {
    const meetings = await Meeting.find()
      .populate("createdBy", "name email")
      .sort({ meetingDate: 1 });

    res.status(200).json({
      success: true,
      meetings,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Get Single Meeting by ID or Link
const getMeetingByLinkOrId = async (req, res) => {
  try {
    const { id } = req.params;
    let meeting = null;

    // Check if ID is a valid MongoDB ObjectId
    if (id.match(/^[0-9a-fA-F]{24}$/)) {
      meeting = await Meeting.findById(id).populate("createdBy", "name email");
    }

    // Normalize id
    let cleanId = id.trim();
    if (cleanId.includes("/")) {
      const parts = cleanId.split("/");
      cleanId = parts[parts.length - 1];
    }
    cleanId = cleanId.replace(/[^a-zA-Z0-9]/g, "").toLowerCase();
    if (cleanId.length === 9) {
      cleanId = `${cleanId.slice(0, 3)}-${cleanId.slice(3, 6)}-${cleanId.slice(6, 9)}`;
    }

    // If not found by ObjectId, search by meetingLink slug/code
    if (!meeting) {
      const rawCode = id.replace(/[^a-zA-Z0-9]/g, "").toLowerCase();
      const flexiblePattern = rawCode.split("").join("[- ]?");
      meeting = await Meeting.findOne({
        $or: [
          { meetingLink: cleanId },
          { meetingLink: { $regex: new RegExp(`^${cleanId}$`, "i") } },
          { meetingLink: { $regex: new RegExp(`(?:^|/)${cleanId}$`, "i") } },
          { meetingLink: { $regex: new RegExp(`(?:^|/)${flexiblePattern}$`, "i") } },
        ],
      }).populate("createdBy", "name email");
    }

    if (!meeting) {
      return res.status(404).json({
        success: false,
        message: "Meeting not found",
      });
    }

    res.status(200).json({
      success: true,
      meeting,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Cancel Meeting
const cancelMeeting = async (req, res) => {
  try {
    const { id } = req.params;
    const meeting = await Meeting.findByIdAndUpdate(
      id,
      { status: "cancelled" },
      { new: true }
    );
    if (!meeting) {
      return res.status(404).json({
        success: false,
        message: "Meeting not found",
      });
    }
    res.status(200).json({
      success: true,
      meeting,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Delete Meeting
const deleteMeeting = async (req, res) => {
  try {
    const { id } = req.params;
    const meeting = await Meeting.findByIdAndDelete(id);
    if (!meeting) {
      return res.status(404).json({
        success: false,
        message: "Meeting not found",
      });
    }
    res.status(200).json({
      success: true,
      message: "Meeting deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Update Meeting details
const updateMeeting = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, meetingDate, meetingLink, videoUrl, size, duration, status } = req.body;

    const meeting = await Meeting.findById(id);
    if (!meeting) {
      return res.status(404).json({
        success: false,
        message: "Meeting not found",
      });
    }

    if (title !== undefined) meeting.title = title;
    if (description !== undefined) meeting.description = description;
    if (meetingDate !== undefined) meeting.meetingDate = meetingDate;
    if (meetingLink !== undefined) meeting.meetingLink = meetingLink;
    if (videoUrl !== undefined) meeting.videoUrl = videoUrl;
    if (size !== undefined) meeting.size = Number(size);
    if (duration !== undefined) meeting.duration = duration;
    if (status !== undefined) meeting.status = status;

    await meeting.save();

    res.status(200).json({
      success: true,
      meeting,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = {
  createMeeting,
  getMeetings,
  getMeetingByLinkOrId,
  cancelMeeting,
  deleteMeeting,
  updateMeeting,
};