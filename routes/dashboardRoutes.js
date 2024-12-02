const express = require("express");
const router = express.Router();
const { getCounts } = require("../controllers/dashboardController"); // Assuming statsController handles this logic

// GET - Fetch total counts
router.get("/counts", getCounts);

module.exports = router;
