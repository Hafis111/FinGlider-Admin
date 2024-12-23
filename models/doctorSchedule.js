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
      type: DataTypes.ENUM("daily", "weekly", "custom", "monthly"), // Added "monthly"
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
          if (this.recurringPattern === "custom" && !/^[01]{7}$/.test(value)) {
            throw new Error(
              "customDays must be a 7-character string of 0s and 1s"
            );
          }
        },
      },
    },
    occurrences: {
      type: DataTypes.JSON, // Supports arrays of objects, e.g., [{"nthOccurrence": "2", "weekDay": "Monday"}]
      allowNull: true, // Only applicable for "monthly" recurringPattern
      validate: {
        isValidOccurrences(value) {
          if (
            this.recurringPattern === "monthly" &&
            (!value || !value.length)
          ) {
            throw new Error(
              "occurrences are required for monthly recurringPattern"
            );
          }
        },
      },
    },
    slotInterval: {
      type: DataTypes.INTEGER, // Slot interval in minutes
      allowNull: true, // Optional for interval-based schedules
    },
    tokenBased: {
      type: DataTypes.BOOLEAN, // Flag for token-based scheduling
      defaultValue: false,
    },
    availableTokens: {
      type: DataTypes.INTEGER, // Number of available tokens
      allowNull: true, // Only relevant if tokenBased is true
    },
    isBlocked: {
      type: DataTypes.BOOLEAN, // Field to mark if the date is blocked
      defaultValue: false, // Default to not blocked
    },
  },
  {
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
