const { Sequelize, DataTypes } = require("sequelize");
const sequelize = require("../Config/db"); // Make sure this is your correct path

const User = sequelize.define("User", {
  name: {
    type: DataTypes.STRING,
    allowNull: true, // Allowing null values for OTP functionality
  },
  place: {
    type: DataTypes.STRING,
    allowNull: true, // Allowing null values for OTP functionality
  },
  phone_number: {
    type: DataTypes.STRING(15),
    allowNull: false,
    unique: true,
  },
  otp: {
    type: DataTypes.STRING(6),
    allowNull: false,
  },
  expires_at: {
    type: DataTypes.DATE,
    allowNull: false,
  },
  verified: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
});

module.exports = { User, sequelize };
