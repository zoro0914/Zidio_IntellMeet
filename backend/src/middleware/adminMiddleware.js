const User = require("../models/User");
const Admin = require("../models/Admin");

const adminMiddleware = async (req, res, next) => {
  try {
    let user = await User.findById(req.user.userId);
    let isAdmin = false;

    if (user && user.role === "admin") {
      isAdmin = true;
    }

    if (!isAdmin) {
      const adminUser = await Admin.findById(req.user.userId);
      if (adminUser) {
        isAdmin = true;
      }
    }

    if (!isAdmin) {
      return res.status(403).json({
        success: false,
        message: "Access Denied: Administrative permissions required."
      });
    }

    next();
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

module.exports = adminMiddleware;
