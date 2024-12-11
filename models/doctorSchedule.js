const { DataTypes } = require("sequelize");
const sequelize = require("../Config/db");
const Doctor = require("./doctor");

const DoctorSchedule = sequelize.define(
  "DoctorSchedule",
  {
    doctorId: {
      type: DataTypes.INTEGER,
      references: {
        model: Doctor,
        key: "id",
      },
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
    recurringPattern: {
      type: DataTypes.ENUM("daily", "weekly", "custom"),
      allowNull: false,
    },
    customDays: {
      type: DataTypes.STRING, // E.g., '1010101' for Mon, Wed, Fri
      allowNull: true,
    },
    startDate: {
      type: DataTypes.DATEONLY,
      allowNull: false,
    },
    bookingCount: {
      type: DataTypes.INTEGER, // Number of bookings for this schedule
      allowNull: false,
    },
    slotInterval: {
      type: DataTypes.INTEGER, // Slot interval in minutes (e.g., 30 for 30-minute slots)
      allowNull: true, // Optional, but only applicable if tokenBased is false
    },
    tokenBased: {
      type: DataTypes.BOOLEAN, // Flag for token-based scheduling
      defaultValue: false, // Default to interval-based slots
    },
    availableTokens: {
      type: DataTypes.INTEGER, // Number of available tokens for a specific time block
      allowNull: true, // Only relevant if tokenBased is true
    },
  },
  {
    // Adding custom validation
    validate: {
      validateSlotAvailability() {
        // If tokenBased is false, slotInterval is required
        if (!this.tokenBased && !this.slotInterval) {
          throw new Error("slotInterval is required when tokenBased is false");
        }

        // If tokenBased is true, availableTokens is required
        if (this.tokenBased && !this.availableTokens) {
          throw new Error(
            "availableTokens is required when tokenBased is true"
          );
        }
      },
    },
  }
);

// Associations
DoctorSchedule.belongsTo(Doctor, { foreignKey: "doctorId" });
Doctor.hasMany(DoctorSchedule, { foreignKey: "doctorId" });

module.exports = DoctorSchedule;
