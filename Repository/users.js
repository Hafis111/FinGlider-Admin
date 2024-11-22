const { User } = require("../models/user");

app.get("/users", async (req, res) => {
  try {
    const users = await User.findAll({
      where: {
        verified: true, // Only show verified users
      },
    });

    if (users.length === 0) {
      return res
        .status(404)
        .json({ success: false, message: "No verified users found" });
    }

    res.json({
      success: true,
      users: users.map((user) => ({
        name: user.name,
        place: user.place,
        phone_number: user.phone_number,
      })),
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});
