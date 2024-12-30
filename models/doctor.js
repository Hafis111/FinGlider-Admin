const { DataTypes } = require("sequelize");
const sequelize = require("../Config/db");
const Department = require("./department");

const Doctor = sequelize.define(
  "Doctor",
  {
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        len: [3, 100], // Ensure the name is between 3 and 100 characters
      },
    },
    departmentId: {
      type: DataTypes.INTEGER,
      references: {
        model: Department,
        key: "id",
      },
      allowNull: false,
      onDelete: "CASCADE", // Automatically delete doctors if the department is deleted
    },
    status: {
      type: DataTypes.ENUM("active", "inactive"), // Status is either 'active' or 'inactive'
      allowNull: false,
      defaultValue: "active", // Default to 'active'
    },
    startDate: {
      type: DataTypes.DATE,
      allowNull: false, // Ensure that a start date is provided
    },
    bookingCount: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 7, // Default to 7 bookings if not specified
    },
    image: {
      // Add the image field for storing the doctor's image URL or file path
      type: DataTypes.STRING, // You can use STRING for storing the image URL/path
      allowNull: true, // Image is optional, you can leave it blank if not provided
    },
  },
  {
    timestamps: true, // Adds createdAt and updatedAt fields
  }
);

Doctor.belongsTo(Department, { foreignKey: "departmentId" });

module.exports = Doctor;
