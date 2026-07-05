const express = require("express");
const router = express.Router();

const authController = require("../controllers/authController");
const authMiddleware = require("../middleware/authMiddleware");

const {
  validateSignUp,
  validateLogIn,
} = require("../validations/authValidation");

const handleValidationErrors = require(
  "../middleware/validationMiddleware"
);

router.post(
  "/register",
  validateSignUp,
  handleValidationErrors,
  authController.signUp
);

router.post(
  "/login",
  validateLogIn,
  handleValidationErrors,
  authController.logIn
);

router.post(
  "/logout",
  authMiddleware,
  authController.logOut
);

router.get(
  "/me",
  authMiddleware,
  authController.getCurrentUser
);

router.put(
  "/update-profile",
  authMiddleware,
  authController.updateProfile
);

router.post(
  "/generate-bio",
  authMiddleware,
  authController.generateUserBio
);

module.exports = router;