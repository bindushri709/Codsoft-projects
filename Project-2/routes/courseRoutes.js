const express = require("express");

const {
    getAllCourses,
    getCourseById,
    createCourse,
    updateCourse,
    deleteCourse,
    searchCourses
} = require("../controllers/courseController");


const router = express.Router();


// GET ALL COURSES
router.get("/", getAllCourses);


// SEARCH COURSES
// Must come before /:id
router.get("/search", searchCourses);


// GET ONE COURSE
router.get("/:id", getCourseById);


// ADD COURSE
router.post("/", createCourse);


// UPDATE COURSE
router.put("/:id", updateCourse);


// DELETE COURSE
router.delete("/:id", deleteCourse);


module.exports = router;