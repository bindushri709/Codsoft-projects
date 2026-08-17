const express = require("express");
const db = require("./config/db");

const app = express();

const studentRoutes = require("./routes/studentRoutes");

const PORT = 5000;

// Middleware
app.use(express.json());

// Student routes
app.use("/api/students", studentRoutes);

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