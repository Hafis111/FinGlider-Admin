const { DataTypes } = require("sequelize");
const sequelize = require("../Config/db");
const Department = require("./department");

const Doctor = sequelize.define("Doctor", {
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  departmentId: {
    type: DataTypes.INTEGER,
    references: {
      model: Department,
      key: "id",
    },
    allowNull: false,
  },
  status: {
    type: DataTypes.BOOLEAN, // True for available, False for not available
    allowNull: false,
    defaultValue: true, // Default to true (available)
  },
});

Doctor.belongsTo(Department, { foreignKey: "departmentId" });

module.exports = Doctor;
