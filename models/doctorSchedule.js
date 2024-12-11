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
      allowNull: true, // Only applicable for "custom" recurringPattern
      validate: {
        isValidCustomDays(value) {
          if (this.recurringPattern === "custom" && !value) {
            throw new Error(
              "customDays is required for custom recurringPattern"
            );
          }
        },
      },
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
      validateSlotConfiguration() {
        // Validate slotInterval and tokenBased configuration
        if (!this.tokenBased && !this.slotInterval) {
          throw new Error("slotInterval is required when tokenBased is false");
        }

        if (
          this.tokenBased &&
          (!this.availableTokens || this.availableTokens <= 0)
        ) {
          throw new Error(
            "availableTokens must be greater than 0 when tokenBased is true"
          );
        }
      },
    },
  }
);

module.exports = DoctorSchedule;
