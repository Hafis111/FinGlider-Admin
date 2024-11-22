const Department = require("../models/department");

// Controller to post a department
const postDepartment = async (req, res) => {
  const { name, description } = req.body;

  // Validate input
  if (!name) {
    return res
      .status(400)
      .json({ success: false, message: "Name is required" });
  }

  try {
    const department = await Department.create({ name, description });
    res.status(201).json({
      success: true,
      message: "Department created successfully",
      department,
    });
  } catch (err) {
    console.error("Error creating department:", err.message);
    res.status(500).json({ success: false, error: err.message });
  }
};

// Controller to get all departments
const getDepartments = async (req, res) => {
  try {
    const departments = await Department.findAll(); // Fetch all departments
    res.status(200).json({
      success: true,
      message: "Departments fetched successfully",
      departments,
    });
  } catch (err) {
    console.error("Error fetching departments:", err.message);
    res.status(500).json({ success: false, error: err.message });
  }
};

module.exports = { postDepartment, getDepartments };
