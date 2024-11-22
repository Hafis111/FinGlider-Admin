const { User } = require("../models/user");

app.post("/verify-otp", async (req, res) => {
  const { phoneNumber, otp } = req.body;

  try {
    // Find the OTP record for the given phone number
    const otpRecord = await User.findOne({
      where: {
        phone_number: phoneNumber,
        otp: otp,
        expires_at: { [Sequelize.Op.gt]: new Date() }, // Ensure OTP is not expired
      },
    });

    // If OTP is invalid or expired
    if (!otpRecord) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid or expired OTP" });
    }

    // Mark the phone number as verified
    await User.update(
      { verified: true }, // Mark as verified
      {
        where: {
          phone_number: phoneNumber,
        },
      }
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
});
