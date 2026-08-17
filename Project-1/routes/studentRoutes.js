const express = require("express");

const {
  getAllStudents,
  getStudentById,
  createStudent,
  updateStudent,
  deleteStudent,
  searchStudents
} = require("../controllers/studentController");

const studentValidation = require("../controllers/studentValidation");

const router = express.Router();

router.get("/", getAllStudents);

// Search MUST come before /:id
router.get("/search", searchStudents);

router.get("/:id", getStudentById);

router.post("/", studentValidation, createStudent);
router.put("/:id", studentValidation, updateStudent);

router.delete("/:id", deleteStudent);

module.exports = router;