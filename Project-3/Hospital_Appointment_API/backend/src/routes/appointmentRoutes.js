const express = require("express");

const {
  createAppointment,
  getMyAppointments,
  getDoctorAppointments,
  updateAppointmentStatus,
  cancelAppointment
} = require("../controllers/appointmentController");

const {
  protect,
  authorizeRoles
} = require("../middleware/authMiddleware");

const router = express.Router();

// Patient books an appointment
router.post(
  "/",
  protect,
  authorizeRoles("patient"),
  createAppointment
);

// Patient views their appointments
router.get(
  "/my",
  protect,
  authorizeRoles("patient"),
  getMyAppointments
);

// Doctor views their appointments
router.get(
  "/doctor",
  protect,
  authorizeRoles("doctor"),
  getDoctorAppointments
);

// Doctor updates appointment status
router.patch(
  "/:id/status",
  protect,
  authorizeRoles("doctor"),
  updateAppointmentStatus
);

// Patient cancels their appointment
router.patch(
  "/:id/cancel",
  protect,
  authorizeRoles("patient"),
  cancelAppointment
);

module.exports = router;