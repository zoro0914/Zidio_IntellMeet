const User = require("../models/User");
const Admin = require("../models/Admin");
const Meeting = require("../models/Meeting");
const Team = require("../models/Team");

// Fetch global stats
const getStats = async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const totalAdmins = await Admin.countDocuments();
    const totalMeetings = await Meeting.countDocuments();
    const totalTeams = await Team.countDocuments();
    
    // Calculate total size used based on Meeting sizes in database
    const totalSizeUsedResult = await Meeting.aggregate([
      { $group: { _id: null, totalSize: { $sum: "$size" } } }
    ]);
    const totalSizeUsed = totalSizeUsedResult.length > 0 ? totalSizeUsedResult[0].totalSize : 0;

    res.status(200).json({
      success: true,
      stats: {
        totalUsers: totalUsers + totalAdmins,
        totalMeetings,
        totalTeams,
        totalSizeUsed
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// Search users
const getUsers = async (req, res) => {
  try {
    const query = req.query.q || "";
    const filter = query
      ? {
          $or: [
            { name: { $regex: query, $options: "i" } },
            { email: { $regex: query, $options: "i" } },
            { role: { $regex: query, $options: "i" } }
          ]
        }
      : {};

    const users = await User.find(filter).select("-password").sort({ createdAt: -1 });
    const admins = await Admin.find(filter).select("-password").sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      users: [...users, ...admins]
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// Update role
const updateUserRole = async (req, res) => {
  try {
    const { userId } = req.params;
    const { role } = req.body;

    if (!["user", "admin"].includes(role)) {
      return res.status(400).json({
        success: false,
        message: "Invalid role value. Must be 'user' or 'admin'."
      });
    }

    let user = await User.findByIdAndUpdate(userId, { role }, { new: true });
    if (!user) {
      user = await Admin.findByIdAndUpdate(userId, { role }, { new: true });
    }

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found"
      });
    }

    res.status(200).json({
      success: true,
      user
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// Delete user account
const deleteUser = async (req, res) => {
  try {
    const { userId } = req.params;
    
    // Prevent admin from self deleting
    if (userId === req.user.userId) {
      return res.status(400).json({
        success: false,
        message: "Administrators cannot delete their own active account."
      });
    }

    let user = await User.findByIdAndDelete(userId);
    if (!user) {
      user = await Admin.findByIdAndDelete(userId);
    }
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found"
      });
    }

    // Pull from teams
    await Team.updateMany(
      { members: userId },
      { $pull: { members: userId } }
    );

    res.status(200).json({
      success: true,
      message: "User deleted successfully"
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// Search system-wide meetings
const getMeetings = async (req, res) => {
  try {
    const query = req.query.q || "";
    const filter = query
      ? {
          $or: [
            { title: { $regex: query, $options: "i" } },
            { description: { $regex: query, $options: "i" } }
          ]
        }
      : {};

    const meetings = await Meeting.find(filter)
      .populate("createdBy", "name email")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      meetings
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// Force delete meeting
const deleteMeeting = async (req, res) => {
  try {
    const { meetingId } = req.params;
    const meeting = await Meeting.findByIdAndDelete(meetingId);
    if (!meeting) {
      return res.status(404).json({
        success: false,
        message: "Meeting not found"
      });
    }

    res.status(200).json({
      success: true,
      message: "Meeting logs deleted successfully"
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// Create a new user from Admin Panel
const createUser = async (req, res) => {
  try {
    const { name, email, role, department, jobTitle, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: "Please fill out name, email and password."
      });
    }

    const existingUser = await User.findOne({ email: email.toLowerCase().trim() }) ||
                         await Admin.findOne({ email: email.toLowerCase().trim() });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "User already exists with this email address."
      });
    }

    let user;
    if (role === "admin") {
      user = await Admin.create({
        name,
        email: email.toLowerCase().trim(),
        password,
        role: "admin",
        department: department || "Administration",
        jobTitle: jobTitle || "System Administrator",
        status: "Active"
      });
    } else {
      user = await User.create({
        name,
        email: email.toLowerCase().trim(),
        password,
        role: role || "user",
        department: department || "Engineering",
        jobTitle: jobTitle || "Developer",
        status: "Active"
      });
    }

    const userObj = user.toObject();
    delete userObj.password;

    res.status(201).json({
      success: true,
      user: userObj
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// Update user details (including department, jobTitle, status) from Admin Panel
const updateUser = async (req, res) => {
  try {
    const { userId } = req.params;
    const { name, email, department, jobTitle, status, role } = req.body;

    let user = await User.findById(userId);
    if (!user) {
      user = await Admin.findById(userId);
    }

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found"
      });
    }

    if (name !== undefined) user.name = name;
    if (email !== undefined) user.email = email.toLowerCase().trim();
    if (department !== undefined) user.department = department;
    if (jobTitle !== undefined) user.jobTitle = jobTitle;
    if (status !== undefined) user.status = status;
    if (role !== undefined) user.role = role.toLowerCase();

    await user.save();

    const userObj = user.toObject();
    delete userObj.password;

    res.status(200).json({
      success: true,
      user: userObj
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// Get platform analytics metrics
const getAnalytics = async (req, res) => {
  try {
    // 1. Get Top Active Users Grouped by meetings hosted
    const topActiveUsersData = await Meeting.aggregate([
      { $group: { _id: "$createdBy", meetingsCount: { $sum: 1 } } },
      { $sort: { meetingsCount: -1 } },
      { $limit: 5 }
    ]);

    const topActiveUsers = [];
    let rank = 1;
    for (const item of topActiveUsersData) {
      if (item._id) {
        let user = await User.findById(item._id).select("name email");
        if (!user) {
          user = await Admin.findById(item._id).select("name email");
        }
        if (user) {
          const durationTotalVal = item.meetingsCount * 45; // average 45 mins
          const durationTotal = durationTotalVal >= 60 
            ? `${(durationTotalVal / 60).toFixed(1)} hrs` 
            : `${durationTotalVal} mins`;
          topActiveUsers.push({
            rank,
            name: user.name,
            email: user.email,
            meetingsCount: item.meetingsCount,
            durationTotal
          });
          rank++;
        }
      }
    }

    // Fallback if no meetings in DB yet
    if (topActiveUsers.length === 0) {
      const someUsers = [...await User.find().limit(3), ...await Admin.find().limit(2)];
      someUsers.slice(0, 3).forEach((u, i) => {
        topActiveUsers.push({
          rank: i + 1,
          name: u.name,
          email: u.email,
          meetingsCount: 0,
          durationTotal: "0 mins"
        });
      });
    }

    // 2. Average Duration
    const allMeetings = await Meeting.find().select("duration");
    let avgDurationStr = "35.4 mins";
    if (allMeetings.length > 0) {
      let totalSecs = 0;
      let count = 0;
      allMeetings.forEach(m => {
        const dur = m.duration || "00:45:00";
        const parts = dur.split(":").map(Number);
        if (parts.length === 3) {
          totalSecs += parts[0] * 3600 + parts[1] * 60 + parts[2];
          count++;
        } else if (parts.length === 2) {
          totalSecs += parts[0] * 60 + parts[1];
          count++;
        }
      });
      if (count > 0) {
        const avgMins = (totalSecs / count) / 60;
        avgDurationStr = `${avgMins.toFixed(1)} mins`;
      }
    }

    // 3. New Users (Last 30 Days)
    const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
    const newUsersCount = await User.countDocuments({ createdAt: { $gte: thirtyDaysAgo } });
    const newAdminsCount = await Admin.countDocuments({ createdAt: { $gte: thirtyDaysAgo } });

    // 4. AI Summary rate (meetings with non-empty summaries)
    const totalMeetings = await Meeting.countDocuments();
    const aiMeetings = await Meeting.countDocuments({ summary: { $ne: "" } });
    const aiSummaryRate = totalMeetings > 0 ? ((aiMeetings / totalMeetings) * 100).toFixed(1) + " %" : "0.0 %";

    res.status(200).json({
      success: true,
      topActiveUsers,
      insights: {
        avgDuration: avgDurationStr,
        newUsersCount: newUsersCount + newAdminsCount,
        aiSummaryRate
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

module.exports = {
  getStats,
  getUsers,
  updateUserRole,
  deleteUser,
  getMeetings,
  deleteMeeting,
  createUser,
  updateUser,
  getAnalytics
};
