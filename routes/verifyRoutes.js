const express = require("express");
const verifyUser = require("../controllers/verifyController");

const router = express.Router();

router.post("/verify-otp", verifyUser);

module.exports = router;
