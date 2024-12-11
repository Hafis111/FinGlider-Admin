const Doctor = require("../models/doctor");
const DoctorSchedule = require("../models/doctorSchedule");
const Department = require("../models/department");
const Booking = require("../models/Booking");
const BlockedSlot = require("../models/BlockedSlot");
const { generateRecurringDates } = require("../utils/reccuringLogic");
const sequelize = require("../Config/db");

const createDoctorWithSchedule = async (req, res) => {
  const { name, departmentId, startDate, bookingCount, schedules } = req.body; // schedules is an array of schedule objects

  const transaction = await sequelize.transaction();

  try {
    // Validate if the departmentId exists
    const department = await Department.findByPk(departmentId);
    if (!department) {
      return res.status(404).json({ error: "Department not found" });
    }

    // Create doctor with global startDate and bookingCount
    const doctor = await Doctor.create(
      { name, departmentId, startDate, bookingCount: bookingCount || 7 },
      { transaction }
    );

    // Prepare the schedules
    const preparedSchedules = schedules.map((schedule) => {
      // Validate token-based scheduling
      if (
        schedule.tokenBased &&
        (!schedule.availableTokens || schedule.availableTokens <= 0)
      ) {
        throw new Error(
          "availableTokens must be greater than 0 for token-based scheduling."
        );
      }

      return {
        doctorId: doctor.id,
        startTime: schedule.startTime,
        endTime: schedule.endTime,
        recurringPattern: schedule.recurringPattern,
        customDays: schedule.customDays,
        slotInterval: schedule.slotInterval || null, // Null for token-based schedules
        tokenBased: schedule.tokenBased,
        availableTokens: schedule.availableTokens || null,
      };
    });

    // Create schedules in bulk
    await DoctorSchedule.bulkCreate(preparedSchedules, { transaction });

    // Commit the transaction
    await transaction.commit();

    // Return success response
    res.status(201).json({
      message: "Doctor and schedules created successfully",
      doctor,
      schedules: preparedSchedules,
    });
  } catch (error) {
    // Rollback the transaction if any error occurs
    await transaction.rollback();
    console.error(error);
    res.status(500).json({
      error: error.message || "Failed to create doctor and schedules",
    });
  }
};

const getDoctorWithSchedules = async (req, res) => {
  try {
    console.log("Fetching doctors with schedules...");

    // Fetch all doctors with their schedules
    const doctors = await Doctor.findAll({
      include: [
        {
          model: DoctorSchedule,
          as: "doctorSchedules",
          include: [
            {
              model: Booking,
              as: "bookedSlots",
              attributes: [
                "startTime",
                "endTime",
                "tokenNumber",
                "patientName",
              ],
            },
            {
              model: BlockedSlot,
              as: "blockedSlots",
              attributes: ["date", "startTime", "endTime"],
            },
          ],
        },
      ],
    });

    console.log("Doctors fetched:", doctors);

    // Format the response
    const formattedDoctors = doctors.map((doctor) => {
      const schedules = doctor.doctorSchedules.map((schedule) => {
        // Calculate recurring dates
        const recurringDates = calculateRecurringDates(schedule);

        return {
          id: schedule.id,
          startTime: schedule.startTime,
          endTime: schedule.endTime,
          recurringPattern: schedule.recurringPattern,
          customDays: schedule.customDays,
          tokenBased: schedule.tokenBased,
          availableTokens: schedule.availableTokens,
          recurringDates: recurringDates.map((date) => {
            // Filter booked and blocked slots for this date
            const bookedSlots = schedule.bookedSlots.filter(
              (slot) => slot.date === date
            );
            const blockedSlots = schedule.blockedSlots.filter(
              (slot) => slot.date === date
            );

            return {
              date,
              remainingTokens: schedule.tokenBased
                ? schedule.availableTokens - bookedSlots.length
                : null,
              bookedSlots,
              blockedSlots,
            };
          }),
        };
      });

      return {
        id: doctor.id,
        name: doctor.name,
        departmentId: doctor.departmentId,
        schedules,
      };
    });

    res.status(200).json(formattedDoctors);
  } catch (error) {
    console.error("Error fetching doctor schedules:", error.message);
    res.status(500).json({ error: "Failed to fetch doctor schedules" });
  }
};

// Helper function to calculate recurring dates
const calculateRecurringDates = (schedule) => {
  const { recurringPattern, customDays, startDate, endDate } = schedule;

  const recurringDates = [];
  const currentDate = new Date(startDate);
  const end = new Date(endDate);

  while (currentDate <= end) {
    const dayIndex = currentDate.getDay(); // 0 for Sunday, 6 for Saturday
    const customDaysArray = customDays?.split("").map(Number);

    if (
      recurringPattern === "daily" ||
      (recurringPattern === "weekly" && customDaysArray[dayIndex] === 1)
    ) {
      recurringDates.push(currentDate.toISOString().split("T")[0]); // Push date in 'YYYY-MM-DD' format
    }

    currentDate.setDate(currentDate.getDate() + 1); // Increment date by 1 day
  }

  return recurringDates;
};

module.exports = { createDoctorWithSchedule, getDoctorWithSchedules };
