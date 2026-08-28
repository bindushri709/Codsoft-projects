const express = require("express");

const {
  createPatientProfile,
  getMyPatientProfile
} = require("../controllers/patientController");

const {
  protect,
  authorizeRoles
} = require("../middleware/authMiddleware");

const router = express.Router();

// Create patient profile
router.post(
  "/profile",
  protect,
  authorizeRoles("patient"),
  createPatientProfile
);

// Get logged-in patient's profile
router.get(
  "/profile",
  protect,
  authorizeRoles("patient"),
  getMyPatientProfile
);

module.exports = router;