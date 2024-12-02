const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors"); // Import cors package
const otpRoutes = require("./routes/otpRoutes");
const userRoutes = require("./routes/userRoutes");
const departmentRoutes = require("./routes/departmentRoutes");
const doctorRoutes = require("./routes/doctorRoutes");
const dashboardRoutes = require("./routes/dashboardRoutes");

const app = express();

// Enable CORS for all routes
app.use(cors());

// Alternatively, you can restrict CORS to a specific origin:
// app.use(cors({ origin: 'http://localhost:3000' }));x

app.use(bodyParser.json());

// Use routes and add base path directly in app.js
app.use("/departments", departmentRoutes);
app.use("/doctors", doctorRoutes);
app.use(otpRoutes);
app.use(userRoutes);
app.use("/dashboard", dashboardRoutes);

const PORT = 3010;
app.listen(PORT, (err) => {
  if (err) {
    console.error("Server startup error:", err);
    process.exit(1); // Exit the process if the server fails to start
  }
  console.log(`Server is running on http://localhost:${PORT}`);
});
