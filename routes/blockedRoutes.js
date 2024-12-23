// routes/blockedDateRoutes.js
const express = require("express");
const { blockDate } = require("../controllers/BlockedDateController");

const router = express.Router();

// Route to block specific dates with a reason
router.post("/", blockDate);

// Route to get blocked dates for a doctor schedule with reason
router.get("/:doctorScheduleId");

module.exports = router;
