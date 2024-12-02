const { User } = require("../models/user"); // Assuming you have a User model
const Department = require("../models/department");
const Doctor = require("../models/doctor");

const getCounts = async (req, res) => {
  try {
    // Fetch counts using Sequelize's count method
    const userCount = await User.count();
    const departmentCount = await Department.count();
    const doctorCount = await Doctor.count();

    res.status(200).json({
      success: true,
      counts: {
        totalUsers: userCount,
        totalDepartments: departmentCount,
        totalDoctors: doctorCount,
      },
    });
  } catch (err) {
    console.error("Error fetching counts:", err.message);
    res.status(500).json({ success: false, error: err.message });
  }
};

module.exports = { getCounts };
