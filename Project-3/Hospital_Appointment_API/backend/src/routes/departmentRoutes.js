const express = require("express");

const {
  createDepartment,
  getDepartments
} = require("../controllers/departmentController");

const {
  protect,
  authorizeRoles
} = require("../middleware/authMiddleware");

const router = express.Router();

// Create department — Admin only
router.post(
  "/",
  protect,
  authorizeRoles("admin"),
  createDepartment
);

// Get all departments — Authenticated users
router.get(
  "/",
  protect,
  getDepartments
);

module.exports = router;