const { DataTypes } = require("sequelize");
const sequelize = require("../Config/db");
const Doctor = require("./doctor");
const User = require("./user"); // Assuming you have a User model for patients

const Appointment = sequelize.define("Appointment", {
  doctorId: {
    type: DataTypes.INTEGER,
    references: {
      model: Doctor,
      key: "id",
    },
    allowNull: false,
  },
  userId: {
    type: DataTypes.INTEGER,
    references: {
      model: User, // Assuming a User model for the patient
      key: "id",
    },
    allowNull: false,
  },
  appointmentTime: {
    type: DataTypes.DATE,
    allowNull: false,
  },
  status: {
    type: DataTypes.ENUM("scheduled", "completed", "cancelled"),
    defaultValue: "scheduled", // Default status is scheduled
  },
});

Appointment.belongsTo(Doctor, { foreignKey: "doctorId" });
Appointment.belongsTo(User, { foreignKey: "userId" });
Doctor.hasMany(Appointment, { foreignKey: "doctorId" });
User.hasMany(Appointment, { foreignKey: "userId" });

module.exports = Appointment;
