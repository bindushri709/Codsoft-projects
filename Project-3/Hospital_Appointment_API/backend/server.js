const express = require("express");
const cors = require("cors");
require("dotenv").config();

const connectDB = require("./src/config/db");

const userRoutes = require("./src/routes/userRoutes");
const patientRoutes = require("./src/routes/patientRoutes");
const doctorRoutes = require("./src/routes/doctorRoutes");
const departmentRoutes = require("./src/routes/departmentRoutes");
const specializationRoutes = require("./src/routes/specializationRoutes");
const availabilityRoutes = require("./src/routes/availabilityRoutes");
const appointmentRoutes = require("./src/routes/appointmentRoutes");

const {
  protect,
  authorizeRoles
} = require("./src/middleware/authMiddleware");

const app = express();

// Connect to MongoDB
connectDB();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use("/api/users", userRoutes);
app.use("/api/patients", patientRoutes);
app.use("/api/doctors", doctorRoutes);
app.use("/api/departments", departmentRoutes);
app.use("/api/specializations", specializationRoutes);
app.use("/api/availability", availabilityRoutes);
app.use("/api/appointments", appointmentRoutes);

// Protected test route
app.get("/api/protected", protect, (req, res) => {
  res.json({
    message: "You have access to the protected route",
    user: req.user
  });
});

// Patient-only test route
app.get(
  "/api/patient",
  protect,
  authorizeRoles("patient"),
  (req, res) => {
    res.json({
      message: "Welcome, patient!",
      user: req.user
    });
  }
);

// Test route
app.get("/", (req, res) => {
  res.json({
    message: "Hospital Appointment API is running!"
  });
});

// Server
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});