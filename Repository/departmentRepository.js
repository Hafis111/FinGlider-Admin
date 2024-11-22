const Department = require("../models/department");

const getAllDepartments = async () => {
  return await Department.findAll({
    attributes: ["id", "name", "description"], // Fetch only necessary fields
  });
};

module.exports = {
  getAllDepartments,
};
