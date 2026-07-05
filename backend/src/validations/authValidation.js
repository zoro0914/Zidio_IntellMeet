const { body } = require("express-validator");

const validateSignUp = [
  body("name")
    .trim()
    .notEmpty()
    .withMessage("Name is required")
    .isLength({ min: 3 })
    .withMessage("Name must be at least 3 characters"),

  body("email")
    .trim()
    .isEmail()
    .withMessage("Please provide a valid email")
    .normalizeEmail(),

  body("password")
    .isLength({ min: 8 })
    .withMessage("Password must be at least 8 characters")

    .matches(/[A-Z]/)
    .withMessage(
      "Password must contain at least one uppercase letter"
    )

    .matches(/[a-z]/)
    .withMessage(
      "Password must contain at least one lowercase letter"
    )

    .matches(/[0-9]/)
    .withMessage(
      "Password must contain at least one number"
    )

    .matches(/[!@#$%^&*(),.?":{}|<>]/)
    .withMessage(
      "Password must contain at least one special character"
    ),
];

const validateLogIn = [
  body("email")
    .trim()
    .isEmail()
    .withMessage("Please provide a valid email")
    .normalizeEmail(),

  body("password")
    .notEmpty()
    .withMessage("Password is required"),
];

module.exports = {
  validateSignUp,
  validateLogIn,
};