// routes/doctorRoutes.js
const express = require("express");
const {
  createDoctorAvailability,
  updateDoctorAvailability,
  getAllDoctors,
  deleteDoctor,
  updateDoctorStatus,
} = require("../controllers/doctorController");

const router = express.Router();

// POST /doctors/availability - Create a doctor with availability
router.post("/availability", createDoctorAvailability);
router.put("/:id/status", updateDoctorStatus);

// PUT /doctors/:id/availability - Update a doctor's availability
router.put("/:id/availability", updateDoctorAvailability);
router.get("/", getAllDoctors);
router.delete("/:id", deleteDoctor);

module.exports = router;
