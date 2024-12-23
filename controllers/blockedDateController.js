const BlockedDate = require("../models/BlockedDate");
const DoctorSchedule = require("../models/doctorSchedule");

const blockDate = async (req, res) => {
  const { doctorScheduleId, blockedDate, reason } = req.body;

  try {
    // Check if the doctor schedule exists
    const doctorSchedule = await DoctorSchedule.findByPk(doctorScheduleId);

    if (!doctorSchedule) {
      return res.status(404).json({ error: "Doctor schedule not found" });
    }

    // Block the schedule for the given date
    doctorSchedule.isBlocked = true; // Mark the schedule as blocked
    await doctorSchedule.save();

    // Save the blocked date entry separately for tracking purposes
    const blockedDateEntry = await BlockedDate.create({
      blockedDate,
      reason,
      scheduleId: doctorSchedule.id, // Ensure that the scheduleId is passed
    });

    res.status(201).json({
      message: "Date blocked successfully",
      blockedDate: blockedDateEntry,
      doctorSchedule: doctorSchedule,
    });
  } catch (error) {
    console.error("Error blocking date:", error.message);
    res.status(500).json({ error: "Failed to block date" });
  }
};

module.exports = {
  blockDate,
};
