const express = require("express");
const {
  postDepartment,
  getDepartments,
} = require("../controllers/departmentController");

const router = express.Router();

router.post("/departments", postDepartment);
router.get("/departments", getDepartments);

module.exports = router;
