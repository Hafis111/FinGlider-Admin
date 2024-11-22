const Department = require("../models/department");

const getAllDepartments = async () => {
  return await Department.findAll({
    attributes: ["id", "name", "description"], // Fetch only necessary fields
  });
};

const deleteDepartmentById = async (id) => {
  return await Department.destroy({ where: { id } });
};

module.exports = {
  getAllDepartments,
  deleteDepartmentById,
};
