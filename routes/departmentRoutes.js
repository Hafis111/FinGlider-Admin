const express = require("express");
const {
  postDepartment,
  getDepartments,
  deleteDepartment,
  updateDepartment,
} = require("../controllers/departmentController");

const router = express.Router();

router.post("/", postDepartment);
router.get("/", getDepartments);
router.delete("/:id", deleteDepartment);
router.put("/:id", updateDepartment);

module.exports = router;
