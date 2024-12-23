const Booking = require("../models/Booking");
const DoctorSchedule = require("../models/doctorSchedule");
const BlockedSlot = require("../models/BlockedSlot");
const sequelize = require("../Config/db");

// Create a new booking
const createBooking = async (req, res) => {
  const {
    doctorScheduleId,
    bookingDate,
    startTime,
    endTime,
    patientName,
    tokenNumber,
  } = req.body;

  try {
    // Fetch the schedule with existing bookings and blocked slots for the same date
    const schedule = await DoctorSchedule.findByPk(doctorScheduleId, {
      include: [
        {
          model: Booking,
          as: "bookedSlots",
          where: { bookingDate },
          required: false,
        },
        {
          model: BlockedSlot,
          as: "blockedSlots",
          where: { blockedDate: bookingDate },
          required: false,
        },
      ],
    });

    if (!schedule) {
      return res.status(404).json({ error: "Doctor schedule not found" });
    }

    // Check if the slot is token-based
    if (schedule.tokenBased) {
      const bookedTokens = schedule.bookedSlots.length;

      if (bookedTokens >= schedule.availableTokens) {
        return res
          .status(400)
          .json({ error: "No available tokens for this schedule" });
      }
    } else {
      // For time-based slots, check for conflicts
      const isTimeConflict = schedule.bookedSlots.some(
        (slot) =>
          slot.startTime === startTime &&
          slot.endTime === endTime &&
          slot.bookingDate === bookingDate
      );

      if (isTimeConflict) {
        return res.status(400).json({ error: "Time slot already booked" });
      }
    }

    // Check if the slot is blocked
    const isBlocked = schedule.blockedSlots.some(
      (slot) =>
        slot.startTime === startTime &&
        slot.endTime === endTime &&
        slot.bookingDate === bookingDate
    );

    if (isBlocked) {
      return res.status(400).json({ error: "This time slot is blocked" });
    }

    // Create the booking
    const booking = await Booking.create({
      doctorScheduleId,
      bookingDate,
      startTime,
      endTime,
      patientName,
      tokenNumber,
    });

    res.status(201).json({ message: "Booking created successfully", booking });
  } catch (error) {
    console.error("Error creating booking:", error.message);
    res.status(500).json({ error: "Failed to create booking" });
  }
};

// Get bookings for a specific doctor schedule
const getBookingsForSchedule = async (req, res) => {
  const { scheduleId } = req.params;

  try {
    const bookings = await Booking.findAll({
      where: { doctorScheduleId: scheduleId },
      attributes: [
        "id",
        "bookingDate",
        "startTime",
        "endTime",
        "patientName",
        "tokenNumber",
        "status",
      ],
    });

    res.status(200).json({ bookings });
  } catch (error) {
    console.error("Error fetching bookings:", error.message);
    res.status(500).json({ error: "Failed to fetch bookings" });
  }
};

// Update booking status
const updateBookingStatus = async (req, res) => {
  const { bookingId } = req.params;
  const { status } = req.body;

  try {
    const booking = await Booking.findByPk(bookingId);

    if (!booking) {
      return res.status(404).json({ error: "Booking not found" });
    }

    booking.status = status;
    await booking.save();

    res
      .status(200)
      .json({ message: "Booking status updated successfully", booking });
  } catch (error) {
    console.error("Error updating booking status:", error.message);
    res.status(500).json({ error: "Failed to update booking status" });
  }
};

// Delete a booking
const deleteBooking = async (req, res) => {
  const { bookingId } = req.params;

  try {
    const booking = await Booking.findByPk(bookingId);

    if (!booking) {
      return res.status(404).json({ error: "Booking not found" });
    }

    await booking.destroy();

    res.status(200).json({ message: "Booking deleted successfully" });
  } catch (error) {
    console.error("Error deleting booking:", error.message);
    res.status(500).json({ error: "Failed to delete booking" });
  }
};

module.exports = {
  createBooking,
  getBookingsForSchedule,
  updateBookingStatus,
  deleteBooking,
};
