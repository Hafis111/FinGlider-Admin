// routes/doctorRoutes.js
const express = require("express");
const {
  createDoctorWithSchedule,
  getDoctorsWithSchedules,
  //   updateDoctorAvailability,
  //   getAllDoctors,
  //   deleteDoctor,
  //   updateDoctorStatus,
} = require("../controllers/doctorController");

const router = express.Router();

// POST /doctors/availability - Create a doctor with availability
router.post("/createDoctorWithSchedule", createDoctorWithSchedule);
router.put("/:id/status");

// PUT /doctors/:id/availability - Update a doctor's availability
router.put("/:id/availability");
router.get("/schedules", getDoctorsWithSchedules);
router.delete("/:id");

module.exports = router;
