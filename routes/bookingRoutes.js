const express = require("express");
const bookingController = require("../controllers/bookingController");

const router = express.Router();

// Route to create a new booking
router.post("/", bookingController.createBooking);

// Route to get all bookings or bookings filtered by doctorScheduleId
router.get("/", bookingController.getBookingsForSchedule);

// Route to update a specific booking by ID
router.put("/:id", bookingController.updateBookingStatus);

// Route to delete a specific booking by ID
router.delete("/:id", bookingController.deleteBooking);

module.exports = router;
