const User = require("../models/User");
const gemini = require("../ai/gemini");

const {
  generateAccessToken,
  generateRefreshToken,
} = require("../utils/generateToken");

// Register
const signUp = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;

    let user = await User.findOne({
      email: email.toLowerCase(),
    });

    if (user) {
      return res.status(400).json({
        success: false,
        message: "User already exists",
      });
    }

    user = await User.create({
      name,
      email,
      password,
    });

    const accessToken = generateAccessToken(
      user._id
    );

    const refreshToken = generateRefreshToken(
      user._id
    );

    user.refreshToken = refreshToken;
    await user.save();

    res.cookie("accessToken", accessToken, {
      httpOnly: true,
      secure:
        process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 15 * 60 * 1000,
    });

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure:
        process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    return res.status(201).json({
      success: true,
      message: "User registered successfully",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
      accessToken,
    });
  } catch (error) {
    next(error);
  }
};

// Login
const logIn = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    let user = await User.findOne({
      email: email.toLowerCase(),
    }).select("+password");

    if (!user) {
      const Admin = require("../models/Admin");
      user = await Admin.findOne({
        email: email.toLowerCase(),
      }).select("+password");
    }

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Invalid credentials",
      });
    }

    if (user.status === "Banned") {
      return res.status(403).json({
        success: false,
        message: "Your account has been suspended by an administrator.",
      });
    }

    const isMatch =
      await user.matchPassword(password);

    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: "Invalid credentials",
      });
    }

    const accessToken = generateAccessToken(
      user._id
    );

    const refreshToken = generateRefreshToken(
      user._id
    );

    user.refreshToken = refreshToken;

    // Auto promote admin accounts
    if (
      user.name.toLowerCase().includes("harsh kumar") ||
      user.email.toLowerCase().includes("hs0037118") ||
      user.email.toLowerCase().includes("admin")
    ) {
      user.role = "admin";
    }

    await user.save();

    res.cookie("accessToken", accessToken, {
      httpOnly: true,
      secure:
        process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 15 * 60 * 1000,
    });

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure:
        process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    return res.status(200).json({
      success: true,
      message: "User logged in successfully",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
      accessToken,
    });
  } catch (error) {
    next(error);
  }
};

// Current User
const getCurrentUser = async (
  req,
  res,
  next
) => {
  try {
    let user = await User.findById(
      req.user.userId
    ).select("-password");

    if (!user) {
      const Admin = require("../models/Admin");
      user = await Admin.findById(
        req.user.userId
      ).select("-password");
    }

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    return res.status(200).json({
      success: true,
      user,
    });
  } catch (error) {
    next(error);
  }
};

// Logout
const logOut = async (
  req,
  res,
  next
) => {
  try {
    res.clearCookie("accessToken");
    res.clearCookie("refreshToken");

    return res.status(200).json({
      success: true,
      message: "Logged out successfully",
    });
  } catch (error) {
    next(error);
  }
};

// Update Profile details
const updateProfile = async (req, res, next) => {
  try {
    const {
      name,
      role,
      password,
      bio,
      department,
      phoneNumber,
      avatar,
      jobTitle,
      company,
      location,
      skills,
      linkedin,
      github
    } = req.body;
    const user = await User.findById(req.user.userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    if (name) user.name = name;
    if (role) user.role = role;
    if (bio !== undefined) user.bio = bio;
    if (department !== undefined) user.department = department;
    if (phoneNumber !== undefined) user.phoneNumber = phoneNumber;
    if (avatar !== undefined) user.avatar = avatar;
    if (jobTitle !== undefined) user.jobTitle = jobTitle;
    if (company !== undefined) user.company = company;
    if (location !== undefined) user.location = location;
    if (linkedin !== undefined) user.linkedin = linkedin;
    if (github !== undefined) user.github = github;

    if (skills !== undefined) {
      if (Array.isArray(skills)) {
        user.skills = skills;
      } else if (typeof skills === "string") {
        user.skills = skills.split(",").map(s => s.trim()).filter(Boolean);
      }
    }

    if (password) {
      const bcrypt = require("bcryptjs");
      const salt = await bcrypt.genSalt(10);
      user.password = await bcrypt.hash(password, salt);
    }

    await user.save();

    // Return updated user (excluding password)
    const updatedUser = user.toObject();
    delete updatedUser.password;

    return res.status(200).json({
      success: true,
      message: "Profile updated successfully",
      user: updatedUser,
    });
  } catch (error) {
    next(error);
  }
};

// Generate AI Biography Tagline
const generateUserBio = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    const tagline = await gemini.generateAIBio(user.name, user.role, user.department || "Engineering");
    user.bio = tagline;
    await user.save();

    const updatedUser = user.toObject();
    delete updatedUser.password;

    return res.status(200).json({
      success: true,
      bio: tagline,
      user: updatedUser,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  signUp,
  logIn,
  getCurrentUser,
  logOut,
  updateProfile,
  generateUserBio,
};