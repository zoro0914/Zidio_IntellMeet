const jwt = require("jsonwebtoken");

const authMiddleware = (req, res, next) => {
  try {
    // Try to get token from cookies (accessToken) or Authorization header (Bearer token)
    const token =
      req.cookies.accessToken ||
      req.headers.authorization?.split(" ")[1];

    if (!token) {
      return res.status(401).json({
        success: false,
        message: "No token provided. Please login.",
      });
    }

    if (!process.env.JWT_SECRET) {
      console.error("JWT_SECRET not configured");
      return res.status(500).json({
        success: false,
        message: "Server configuration error",
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    console.error("Token verification error:", error.message);
    
    if (error.name === "TokenExpiredError") {
      return res.status(401).json({
        success: false,
        message: "Token has expired. Please login again.",
      });
    }

    if (error.name === "JsonWebTokenError") {
      return res.status(401).json({
        success: false,
        message: "Invalid token format",
      });
    }

    res.status(401).json({
      success: false,
      message: "Token is not valid",
    });
  }
};

module.exports = authMiddleware;
