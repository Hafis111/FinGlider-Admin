const { DataTypes } = require("sequelize");
const sequelize = require("../Config/db");
const DoctorSchedule = require("./doctorSchedule"); // Assuming it's located in the same directory

const BlockedSlot = sequelize.define(
  "BlockedSlot",
  {
    doctorScheduleId: {
      type: DataTypes.INTEGER,
      references: {
        model: DoctorSchedule,
        key: "id",
      },
      allowNull: false,
    },
    blockedDate: {
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
    reason: {
      type: DataTypes.STRING, // e.g., "Vacation", "Emergency"
      allowNull: true,
    },
  },
  {}
);

// Association with DoctorSchedule
BlockedSlot.belongsTo(DoctorSchedule, { foreignKey: "doctorScheduleId" });
DoctorSchedule.hasMany(BlockedSlot, { foreignKey: "doctorScheduleId" });

module.exports = BlockedSlot;
