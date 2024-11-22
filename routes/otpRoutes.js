const express = require("express");
const sendOtp = require("../controllers/otpController");
const verifyOtp = require("../controllers/verifyController");
const { body, validationResult } = require("express-validator");

const router = express.Router();

// Middleware for validating request body
const validateRequest = (validations) => {
  return async (req, res, next) => {
    await Promise.all(validations.map((validation) => validation.run(req)));
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      console.log("Validation errors: ", errors.array()); // Debug log for validation errors
      return res.status(400).json({ success: false, errors: errors.array() });
    }
    next();
  };
};

// Route for sending OTP
router.post(
  "/send-otp",
  validateRequest([
    body("phoneNumber")
      .notEmpty()
      .withMessage("Phone number is required")
      .matches(/^[0-9]{10}$/)
      .withMessage("Invalid phone number format"),
    body("name").notEmpty().withMessage("Name is required"),
    body("place").notEmpty().withMessage("Place is required"),
  ]),
  sendOtp
);

// Route for verifying OTP
router.post(
  "/verify-otp",
  validateRequest([
    body("phoneNumber")
      .notEmpty()
      .withMessage("Phone number is required")
      .matches(/^[0-9]{10}$/)
      .withMessage("Invalid phone number format"),
    body("otp")
      .notEmpty()
      .withMessage("OTP is required")
      .isLength({ min: 6, max: 6 })
      .withMessage("OTP must be 6 digits"),
  ]),
  verifyOtp
);

module.exports = router;
