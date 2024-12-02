const { DataTypes } = require("sequelize");
const sequelize = require("../Config/db");
const Doctor = require("./doctor");

const DoctorAvailability = sequelize.define("DoctorAvailability", {
  day: {
    type: DataTypes.STRING, // Day like 'Monday', 'Tuesday', etc.
    allowNull: false,
  },
  timeRange: {
    type: DataTypes.STRING, // Format '10:00 AM - 4:00 PM'
    allowNull: false,
  },
  availableSlots: {
    type: DataTypes.INTEGER, // Number of available slots
    allowNull: false,
  },
  doctorId: {
    type: DataTypes.INTEGER,
    references: {
      model: Doctor,
      key: "id",
    },
    allowNull: false,
  },
});

Doctor.hasMany(DoctorAvailability, { foreignKey: "doctorId" });
DoctorAvailability.belongsTo(Doctor, { foreignKey: "doctorId" });

module.exports = DoctorAvailability;
