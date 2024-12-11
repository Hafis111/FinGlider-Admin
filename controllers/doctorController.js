const Doctor = require("../models/doctor");
const DoctorSchedule = require("../models/doctorSchedule");
const Department = require("../models/department");
const Booking = require("../models/Booking");
const BlockedSlot = require("../models/BlockedSlot");
const { generateRecurringDates } = require("../utils/reccuringLogic");
const sequelize = require("../Config/db");

const createDoctorWithSchedule = async (req, res) => {
  const { name, departmentId, schedule } = req.body; // schedule is an array of schedule objects

  const transaction = await sequelize.transaction();

  try {
    // Validate if the departmentId exists
    const department = await Department.findByPk(departmentId);
    if (!department) {
      return res.status(404).json({ error: "Department not found" });
    }

    // Create doctor
    const doctor = await Doctor.create({ name, departmentId }, { transaction });

    // Prepare the schedules
    const schedules = schedule.map((s) => {
      // Validate token-based scheduling
      if (s.tokenBased && (!s.availableTokens || s.availableTokens <= 0)) {
        throw new Error(
          "availableTokens must be greater than 0 for token-based scheduling."
        );
      }

      // Validate bookingCount
      if (s.bookingCount && s.bookingCount <= 0) {
        throw new Error("bookingCount must be a positive number.");
      }

      return {
        doctorId: doctor.id,
        startTime: s.startTime,
        endTime: s.endTime,
        recurringPattern: s.recurringPattern,
        customDays: s.customDays,
        startDate: s.startDate,
        bookingCount: s.bookingCount || 7, // Defaults to 7 if not provided
        slotInterval: s.slotInterval || null, // Null for token-based
        tokenBased: s.tokenBased,
        availableTokens: s.availableTokens || null,
      };
    });

    // Create schedules in bulk
    await DoctorSchedule.bulkCreate(schedules, { transaction });

    // Commit the transaction
    await transaction.commit();

    // Return success response
    res.status(201).json({
      message: "Doctor and schedules created successfully",
      doctor,
      schedules,
    });
  } catch (error) {
    // Rollback the transaction if any error occurs
    await transaction.rollback();
    console.error(error);
    res
      .status(500)
      .json({ error: error.message || "Failed to create doctor and schedule" });
  }
};

const getDoctorsWithSchedules = async (req, res) => {
  try {
    // Fetch all doctors with schedules, bookings, and blocked slots
    const doctors = await Doctor.findAll({
      include: [
        {
          model: DoctorSchedule,
          include: [
            {
              model: Booking,
            },
            {
              model: BlockedSlot,
            },
          ],
        },
      ],
    });

    // Process the data
    const result = doctors.map((doctor) => {
      return {
        id: doctor.id,
        name: doctor.name,
        departmentId: doctor.departmentId,
        schedules: doctor.DoctorSchedules.map((schedule) => {
          // Generate recurring dates
          const recurringDates = generateRecurringDates(
            schedule.startDate,
            schedule.recurringPattern,
            schedule.customDays,
            schedule.bookingCount
          );

          // Process each recurring date
          const dates = recurringDates.map((date) => {
            // Filter bookings and blocked slots for the current date
            const bookedSlots = schedule.Bookings.filter(
              (booking) => booking.bookingDate === date
            ).map((booking) => ({
              startTime: booking.startTime,
              endTime: booking.endTime,
              tokenNumber: booking.tokenNumber, // Ensure tokenNumber exists in the Booking model
              patientName: booking.patientName,
            }));

            const blockedSlots = schedule.BlockedSlots.filter(
              (blockedSlot) => blockedSlot.blockedDate === date
            ).map((blockedSlot) => ({
              startTime: blockedSlot.startTime,
              endTime: blockedSlot.endTime,
              reason: blockedSlot.reason,
            }));

            // Calculate remaining tokens
            const remainingTokens =
              schedule.tokenBased &&
              schedule.availableTokens - bookedSlots.length;

            return {
              date,
              remainingTokens: remainingTokens || null,
              bookedSlots,
              blockedSlots,
            };
          });

          return {
            id: schedule.id,
            startTime: schedule.startTime,
            endTime: schedule.endTime,
            recurringPattern: schedule.recurringPattern,
            customDays: schedule.customDays,
            startDate: schedule.startDate,
            bookingCount: schedule.bookingCount,
            tokenBased: schedule.tokenBased,
            availableTokens: schedule.availableTokens,
            recurringDates: dates,
          };
        }),
      };
    });

    // Send the response
    res.json(result);
  } catch (error) {
    console.error("Error fetching doctors with schedules:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

module.exports = { createDoctorWithSchedule, getDoctorsWithSchedules };
