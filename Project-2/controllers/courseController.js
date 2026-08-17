const db = require("../config/db");

// =========================
// GET ALL COURSES
// =========================

const getAllCourses = (req, res) => {

    const sql = `
        SELECT *
        FROM courses
        ORDER BY id ASC
    `;

    db.query(sql, (err, results) => {

        if (err) {

            console.error("Database error:", err);

            return res.status(500).json({
                message: "Database error"
            });

        }

        res.json({
            courses: results
        });

    });

};


// =========================
// GET ONE COURSE
// =========================

const getCourseById = (req, res) => {

    const id = req.params.id;

    const sql =
        "SELECT * FROM courses WHERE id = ?";

    db.query(
        sql,
        [id],
        (err, results) => {

            if (err) {

                console.error(
                    "Database error:",
                    err
                );

                return res.status(500).json({
                    message: "Database error"
                });

            }

            if (results.length === 0) {

                return res.status(404).json({
                    message: "Course not found"
                });

            }

            res.json(results[0]);

        }
    );

};


// =========================
// CREATE COURSE
// =========================

const createCourse = (req, res) => {

    const {
        name,
        code,
        department,
        credits
    } = req.body;


    const sql = `
        INSERT INTO courses
        (name, code, department, credits)
        VALUES (?, ?, ?, ?)
    `;


    db.query(
        sql,
        [
            name,
            code,
            department,
            credits
        ],
        (err, result) => {

            if (err) {

                console.error(
                    "Database error:",
                    err
                );


                if (
                    err.code === "ER_DUP_ENTRY"
                ) {

                    return res.status(409).json({
                        message:
                            "Course code already exists"
                    });

                }


                return res.status(500).json({
                    message: "Database error"
                });

            }


            res.status(201).json({

                message:
                    "Course added successfully",

                id:
                    result.insertId

            });

        }
    );

};


// =========================
// UPDATE COURSE
// =========================

const updateCourse = (req, res) => {

    const id = req.params.id;

    const {
        name,
        code,
        department,
        credits
    } = req.body;


    const sql = `
        UPDATE courses
        SET
            name = ?,
            code = ?,
            department = ?,
            credits = ?
        WHERE id = ?
    `;


    db.query(
        sql,
        [
            name,
            code,
            department,
            credits,
            id
        ],
        (err, result) => {

            if (err) {

                console.error(
                    "Database error:",
                    err
                );


                if (
                    err.code === "ER_DUP_ENTRY"
                ) {

                    return res.status(409).json({
                        message:
                            "Course code already exists"
                    });

                }


                return res.status(500).json({
                    message: "Database error"
                });

            }


            if (
                result.affectedRows === 0
            ) {

                return res.status(404).json({
                    message: "Course not found"
                });

            }


            res.json({
                message:
                    "Course updated successfully"
            });

        }
    );

};


// =========================
// DELETE COURSE
// =========================

const deleteCourse = (req, res) => {

    const id = req.params.id;


    const sql =
        "DELETE FROM courses WHERE id = ?";


    db.query(
        sql,
        [id],
        (err, result) => {

            if (err) {

                console.error(
                    "Database error:",
                    err
                );

                return res.status(500).json({
                    message: "Database error"
                });

            }


            if (
                result.affectedRows === 0
            ) {

                return res.status(404).json({
                    message: "Course not found"
                });

            }


            res.json({
                message:
                    "Course deleted successfully"
            });

        }
    );

};


// =========================
// SEARCH COURSES
// =========================

const searchCourses = (req, res) => {

    const {
        name,
        code,
        department
    } = req.query;


    let sql =
        "SELECT * FROM courses WHERE 1=1";

    const values = [];


    if (name) {

        sql +=
            " AND name LIKE ?";

        values.push(
            `%${name}%`
        );

    }


    if (code) {

        sql +=
            " AND code LIKE ?";

        values.push(
            `%${code}%`
        );

    }


    if (department) {

        sql +=
            " AND department LIKE ?";

        values.push(
            `%${department}%`
        );

    }


    sql +=
        " ORDER BY id ASC";


    db.query(
        sql,
        values,
        (err, results) => {

            if (err) {

                console.error(
                    "Database error:",
                    err
                );

                return res.status(500).json({
                    message:
                        "Database error"
                });

            }


            res.json({
                courses: results
            });

        }
    );

};


// =========================
// EXPORT
// =========================

module.exports = {

    getAllCourses,

    getCourseById,

    createCourse,

    updateCourse,

    deleteCourse,

    searchCourses

};