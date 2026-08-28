const express = require("express");

const {
  createDoctorProfile,
  getMyDoctorProfile,
  getAllDoctors
} = require("../controllers/doctorController");

const {
  protect,
  authorizeRoles
} = require("../middleware/authMiddleware");

const router = express.Router();


// Get all doctors with optional filtering
router.get(
  "/",
  protect,
  getAllDoctors
);


// Create doctor profile
router.post(
  "/profile",
  protect,
  authorizeRoles("doctor"),
  createDoctorProfile
);


// Get logged-in doctor's profile
router.get(
  "/profile",
  protect,
  authorizeRoles("doctor"),
  getMyDoctorProfile
);


module.exports = router;