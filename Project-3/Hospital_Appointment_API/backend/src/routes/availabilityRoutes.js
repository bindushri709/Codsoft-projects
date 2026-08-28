const express = require("express");

const {
  createAvailability,
  getAvailability,
  deleteAvailability
} = require("../controllers/availabilityController");

const {
  protect,
  authorizeRoles
} = require("../middleware/authMiddleware");

const router = express.Router();

// ==========================================
// DOCTOR CREATES AVAILABILITY
// ==========================================

router.post(
  "/",
  protect,
  authorizeRoles("doctor"),
  createAvailability
);

// ==========================================
// AUTHENTICATED USERS VIEW AVAILABILITY
// ==========================================

router.get(
  "/",
  protect,
  getAvailability
);

// ==========================================
// DOCTOR DELETES AVAILABILITY
// ==========================================

router.delete(
  "/:id",
  protect,
  authorizeRoles("doctor"),
  deleteAvailability
);

module.exports = router;