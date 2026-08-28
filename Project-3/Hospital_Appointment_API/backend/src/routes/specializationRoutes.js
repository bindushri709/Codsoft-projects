const express = require("express");

const {
  createSpecialization,
  getSpecializations
} = require("../controllers/specializationController");

const {
  protect,
  authorizeRoles
} = require("../middleware/authMiddleware");

const router = express.Router();

// Create specialization — Admin only
router.post(
  "/",
  protect,
  authorizeRoles("admin"),
  createSpecialization
);

// Get all specializations — Authenticated users
router.get(
  "/",
  protect,
  getSpecializations
);

module.exports = router;