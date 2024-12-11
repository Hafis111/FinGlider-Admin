const { DataTypes } = require("sequelize");
const sequelize = require("../Config/db");
const DoctorSchedule = require("./doctorSchedule");

const Booking = sequelize.define("Booking", {
  doctorScheduleId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: DoctorSchedule,
      key: "id",
    },
  },
  bookingDate: {
    type: DataTypes.DATEONLY,
    allowNull: false,
  },
  startTime: {
    type: DataTypes.TIME,
    allowNull: false,
  },
  endTime: {
    type: DataTypes.TIME,
    allowNull: false,
  },
  status: {
    type: DataTypes.ENUM("booked", "cancelled", "completed"),
    defaultValue: "booked",
  },
  patientName: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  tokenNumber: {
    // Add this if missing
    type: DataTypes.INTEGER,
    allowNull: true, // If token-based
  },
});

// Define association
Booking.belongsTo(DoctorSchedule, { foreignKey: "doctorScheduleId" });
DoctorSchedule.hasMany(Booking, { foreignKey: "doctorScheduleId" });

module.exports = Booking;
