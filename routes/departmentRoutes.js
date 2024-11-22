const express = require("express");
const {
  postDepartment,
  getDepartments,
  deleteDepartment,
} = require("../controllers/departmentController");

const router = express.Router();

// Define only the dynamic part of the routes (no "/departments" prefix here)
router.post("/", postDepartment); // POST request to create a department
router.get("/", getDepartments); // GET request to fetch all departments
router.delete("/:id", deleteDepartment); // DELETE request to delete a specific department by id

module.exports = router;
