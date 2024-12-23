const Doctor = require("./doctor");
const DoctorSchedule = require("./doctorSchedule");
const Booking = require("./Booking");
const BlockedDate = require("./BlockedDate");

const setupAssociations = () => {
  // Doctor and DoctorSchedule association
  Doctor.hasMany(DoctorSchedule, {
    foreignKey: "doctorId",
    as: "doctorSchedules",
  });
  DoctorSchedule.belongsTo(Doctor, { foreignKey: "doctorId" });

  // DoctorSchedule and Booking association
  DoctorSchedule.hasMany(Booking, {
    foreignKey: "scheduleId",
    as: "bookedSlots",
  });
  Booking.belongsTo(DoctorSchedule, { foreignKey: "scheduleId" });

  // DoctorSchedule and BlockedDate association (should be DoctorSchedule -> BlockedDate)
  DoctorSchedule.hasMany(BlockedDate, {
    foreignKey: "scheduleId",
    as: "blockedDates",
  });
  BlockedDate.belongsTo(DoctorSchedule, { foreignKey: "scheduleId" });
};

module.exports = setupAssociations;
