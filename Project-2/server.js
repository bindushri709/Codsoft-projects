const express = require("express");
const cors = require("cors");
const db = require("./config/db");

const app = express();
app.use(cors());

const studentRoutes = require("./routes/studentRoutes");
const courseRoutes = require("./routes/courseRoutes");

const PORT = 5000;

// Middleware
app.use(express.json());

// Student routes
app.use("/api/students", studentRoutes);
app.use("/api/courses", courseRoutes);

// Home page
app.get("/", (req, res) => {
    res.json({
        message: "Student Management API is running!"
    });
});

// Start server
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});