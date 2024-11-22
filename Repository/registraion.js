const { User } = require("../models/user");
const { generateOTP, getExpirationTime } = require("../utils/helpers");

// Utility function to send consistent responses
const sendResponse = (res, status, success, message, data = null) => {
  res.status(status).json({ success, message, data });
};

// Registration endpoint
app.post("/send-otp", async (req, res) => {
  const { name, place, phoneNumber } = req.body;

  // Validate input fields
  if (!name || !place || !phoneNumber) {
    return sendResponse(
      res,
      400,
      false,
      "Name, place, and phone number are required"
    );
  }

  // Validate phone number format
  const phoneRegex = /^[0-9]{10}$/;
  if (!phoneRegex.test(phoneNumber)) {
    return sendResponse(res, 400, false, "Invalid phone number format");
  }

  const otp = generateOTP();
  const expiresAt = getExpirationTime();

  try {
    // Upsert the OTP record for this phone number
    const [user, created] = await User.upsert({
      name,
      place,
      phone_number: phoneNumber,
      otp,
      expires_at: expiresAt,
      verified: false,
    });

    console.log(
      created
        ? `New OTP sent to ${phoneNumber}: ${otp}`
        : `Updated OTP sent to ${phoneNumber}: ${otp}`
    );

    return sendResponse(res, 200, true, "OTP sent");
  } catch (err) {
    console.error("Error creating/updating OTP record:", err);

    if (err.name === "SequelizeUniqueConstraintError") {
      return sendResponse(res, 400, false, "Phone number already exists");
    }

    return sendResponse(res, 500, false, "Internal server error");
  }
});
