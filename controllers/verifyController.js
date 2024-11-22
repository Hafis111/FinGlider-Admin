const { User } = require("../models/user");
const { Sequelize } = require("sequelize");

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

module.exports = verifyUser;
