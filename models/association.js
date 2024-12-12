// models/associations.js

const Doctor = require("./doctor");
const DoctorSchedule = require("./doctorSchedule");
const Booking = require("./Booking");
const BlockedSlot = require("./BlockedSlot");

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

  // DoctorSchedule and BlockedSlot association
  DoctorSchedule.hasMany(BlockedSlot, {
    foreignKey: "scheduleId",
    as: "blockedSlots",
  });
  BlockedSlot.belongsTo(DoctorSchedule, { foreignKey: "scheduleId" });
};

module.exports = setupAssociations;
