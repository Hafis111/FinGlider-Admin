const Department = require("../models/department");

// Method to get all departments with selected attributes (id, name, description)
const getAllDepartments = async () => {
  try {
    return await Department.findAll({
      attributes: ["id", "name", "description"], // Fetch only necessary fields
    });
  } catch (err) {
    console.error("Error fetching departments:", err.message);
    throw err; // Propagate error to controller
  }
};

// Method to delete a department by ID
const deleteDepartmentById = async (id) => {
  try {
    return await Department.destroy({
      where: { id }, // Where clause to match the department by ID
    });
  } catch (err) {
    console.error("Error deleting department:", err.message);
    throw err; // Propagate error to controller
  }
};

// Method to update a department by ID
const updateDepartmentById = async (id, updates) => {
  try {
    const department = await Department.findByPk(id); // Find department by primary key (ID)

    // If department is not found, return null
    if (!department) {
      return null;
    }

    // Update department fields with the provided values
    department.name = updates.name;
    department.description = updates.description;

    // Save the updated department to the database
    await department.save();

    // Return the updated department
    return department;
  } catch (err) {
    console.error(
      "Error in repository while updating department:",
      err.message
    );
    throw err; // Propagate error to controller
  }
};

module.exports = {
  getAllDepartments,
  deleteDepartmentById,
  updateDepartmentById, // Export the update method
};
