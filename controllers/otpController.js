const { User } = require("../models/user");
const { Sequelize } = require("sequelize");
const { generateOTP, getExpirationTime } = require("../utils/helpers");

const sendOtp = async (req, res) => {
  const { phoneNumber, name, place } = req.body; // Extract name and place from the request body

  // Validate phone number format
  const phoneRegex = /^[0-9]{10}$/; // Adjust regex as needed
  if (!phoneRegex.test(phoneNumber)) {
    return res.status(400).json({
      success: false,
      message: "Invalid phone number format",
    });
  }

  const otp = generateOTP();
  const expiresAt = getExpirationTime();

  try {
    // Check if there's already an OTP entry for this phone number
    const existingUser = await User.findOne({
      where: { phone_number: phoneNumber },
    });

    if (existingUser) {
      // Update the OTP and expiration time if the user already exists
      await User.update(
        { otp, expires_at: expiresAt, verified: false },
        { where: { phone_number: phoneNumber } }
      );
    } else {
      // Create a new user record if not exists
      await User.create({
        phone_number: phoneNumber,
        otp,
        expires_at: expiresAt,
        verified: false,
        name, // Include name field
        place, // Include place field
      });
    }

    console.log(`OTP sent to ${phoneNumber}: ${otp}`);
    return res.json({ success: true, message: "OTP sent" });
  } catch (err) {
    console.error("Error sending OTP:", err.message);
    return res.status(500).json({ success: false, error: err.message });
  }
};

const verifyUser = async (req, res) => {
  const { phoneNumber, otp } = req.body;

  try {
    const otpRecord = await User.findOne({
      where: {
        phone_number: phoneNumber,
        otp: otp,
        expires_at: { [Sequelize.Op.gt]: new Date() },
      },
    });

    if (!otpRecord) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid or expired OTP" });
    }

    await User.update(
      { verified: true },
      { where: { phone_number: phoneNumber } }
    );

    console.log(`Phone number ${phoneNumber} verified`);

    res.json({
      success: true,
      message: "OTP verified and phone number verified",
      user: {
        name: otpRecord.name,
        place: otpRecord.place,
        phone_number: otpRecord.phone_number,
      },
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};
module.exports = sendOtp;
