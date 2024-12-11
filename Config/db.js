require("dotenv").config();
const { Sequelize } = require("sequelize");

// Initialize Sequelize with environment variables
const sequelize = new Sequelize({
  database: process.env.DB_NAME,
  username: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  dialect: "mysql",
  logging: console.log,
});

// Test database connection
sequelize
  .authenticate()
  .then(() => console.log("Database connection established"))
  .catch((err) => {
    console.error("Unable to connect to the database:", err);
    process.exit(1); // Exit the process if connection fails
  });

// Sync models with the database
sequelize
  .sync({ alter: true }) // Automatically update the schema without dropping data
  .then(() => console.log("Database synchronized successfully"))
  .catch((err) => console.error("Error synchronizing database:", err));

// Export the sequelize instance
module.exports = sequelize;
