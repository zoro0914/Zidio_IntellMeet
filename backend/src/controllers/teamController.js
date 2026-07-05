const Team = require("../models/Team");
const TeamMessage = require("../models/TeamMessage");
const User = require("../models/User");

// @desc    Create a new team
// @route   POST /api/teams
// @access  Private
const createTeam = async (req, res, next) => {
  try {
    const { name, description } = req.body;
    const userId = req.user.userId;

    if (!name) {
      return res.status(400).json({
        success: false,
        message: "Team name is required",
      });
    }

    const team = await Team.create({
      name,
      description,
      creator: userId,
      members: [userId],
    });

    const populatedTeam = await Team.findById(team._id)
      .populate("creator", "name email role avatar")
      .populate("members", "name email role avatar");

    res.status(201).json({
      success: true,
      message: "Team created successfully",
      team: populatedTeam,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all teams for the logged-in user
// @route   GET /api/teams
// @access  Private
const getTeams = async (req, res, next) => {
  try {
    const userId = req.user.userId;

    const teams = await Team.find({
      members: userId,
    })
      .populate("creator", "name email role avatar")
      .populate("members", "name email role avatar")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      teams,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Add a member to a team
// @route   POST /api/teams/:teamId/members
// @access  Private
const addMember = async (req, res, next) => {
  try {
    const { teamId } = req.params;
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({
        success: false,
        message: "Email address is required",
      });
    }

    const userToAdd = await User.findOne({ email: email.toLowerCase() });
    if (!userToAdd) {
      return res.status(404).json({
        success: false,
        message: "User not found with this email",
      });
    }

    const team = await Team.findById(teamId);
    if (!team) {
      return res.status(404).json({
        success: false,
        message: "Team not found",
      });
    }

    // Check if user is already a member
    if (team.members.includes(userToAdd._id)) {
      return res.status(400).json({
        success: false,
        message: "User is already a member of this team",
      });
    }

    team.members.push(userToAdd._id);
    await team.save();

    const populatedTeam = await Team.findById(teamId)
      .populate("creator", "name email role avatar")
      .populate("members", "name email role avatar");

    res.status(200).json({
      success: true,
      message: "Member added successfully",
      team: populatedTeam,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get messages for a specific team
// @route   GET /api/teams/:teamId/messages
// @access  Private
const getTeamMessages = async (req, res, next) => {
  try {
    const { teamId } = req.params;
    const userId = req.user.userId;

    const team = await Team.findById(teamId);
    if (!team) {
      return res.status(404).json({
        success: false,
        message: "Team not found",
      });
    }

    // Check if user is member
    if (!team.members.includes(userId)) {
      return res.status(403).json({
        success: false,
        message: "You are not authorized to view messages in this team",
      });
    }

    const messages = await TeamMessage.find({ team: teamId })
      .populate("sender", "name email role avatar")
      .sort({ createdAt: 1 });

    res.status(200).json({
      success: true,
      messages,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Remove a member from a team
// @route   DELETE /api/teams/:teamId/members/:memberId
// @access  Private
const removeMember = async (req, res, next) => {
  try {
    const { teamId, memberId } = req.params;
    const currentUserId = req.user.userId;

    const team = await Team.findById(teamId);
    if (!team) {
      return res.status(404).json({
        success: false,
        message: "Team not found",
      });
    }

    // Only creator can remove members, or a member can remove themselves (leave the team)
    const isCreator = team.creator.toString() === currentUserId;
    const isSelfRemoval = memberId === currentUserId;

    if (!isCreator && !isSelfRemoval) {
      return res.status(403).json({
        success: false,
        message: "Only the team creator can remove members, or members can leave themselves",
      });
    }

    // Creator cannot be removed from the team by this endpoint (they must delete the team instead)
    if (memberId === team.creator.toString()) {
      return res.status(400).json({
        success: false,
        message: "Team creator cannot be removed from the team",
      });
    }

    team.members = team.members.filter((m) => m.toString() !== memberId);
    await team.save();

    const populatedTeam = await Team.findById(teamId)
      .populate("creator", "name email role avatar")
      .populate("members", "name email role avatar");

    res.status(200).json({
      success: true,
      message: isSelfRemoval ? "You left the team successfully" : "Member removed successfully",
      team: populatedTeam,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createTeam,
  getTeams,
  addMember,
  getTeamMessages,
  removeMember,
};
