const db = require("../config/db");

// GET ALL STUDENTS
const getAllStudents = (req, res) => {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 1000;
    const offset = (page - 1) * limit;

    const sort = req.query.sort || "id";
    const order = req.query.order === "desc" ? "DESC" : "ASC";

    const allowedColumns = ["id", "name", "email", "department", "semester"];

    if (!allowedColumns.includes(sort)) {
        return res.status(400).json({
            message: "Invalid sort field"
        });
    }

    const sql = `SELECT * FROM students 
                 ORDER BY ${sort} ${order}
                 LIMIT ? OFFSET ?`;

    db.query(sql, [limit, offset], (err, results) => {
        if (err) {
            return res.status(500).json({
                message: "Database error"
            });
        }

        res.json({
            page,
            limit,
            sort,
            order,
            students: results
        });
    });
};

// GET ONE STUDENT
const getStudentById = (req, res) => {
    const id = req.params.id;

    const sql = "SELECT * FROM students WHERE id = ?";

    db.query(sql, [id], (err, results) => {
        if (err) {
            return res.status(500).json({
                message: "Database error",
                error: err
            });
        }

        if (results.length === 0) {
            return res.status(404).json({
                message: "Student not found"
            });
        }

        res.json(results[0]);
    });
};

// ADD NEW STUDENT
const createStudent = (req, res) => {
    const { name, email, department, semester } = req.body;

    const sql =
        "INSERT INTO students (name, email, department, semester) VALUES (?, ?, ?, ?)";

    db.query(
        sql,
        [name, email, department, semester],
        (err, result) => {
           if (err) {
    console.error("Database error:", err);

    if (err.code === "ER_DUP_ENTRY") {
        return res.status(409).json({
            message: "Email already exists"
        });
    }

    return res.status(500).json({
        message: "Database error"
    });
}

            res.status(201).json({
                message: "Student added successfully",
                id: result.insertId
            });
        }
    );
};

// UPDATE STUDENT
const updateStudent = (req, res) => {
    const id = req.params.id;
    const { name, email, department, semester } = req.body;

    const sql =
        "UPDATE students SET name=?, email=?, department=?, semester=? WHERE id=?";

    db.query(
        sql,
        [name, email, department, semester, id],
        (err, result) => {
            if (err) {
                return res.status(500).json({
                    message: "Database error",
                    error: err
                });
            }

            if (result.affectedRows === 0) {
                return res.status(404).json({
                    message: "Student not found"
                });
            }

            res.json({
                message: "Student updated successfully"
            });
        }
    );
};

// DELETE STUDENT
const deleteStudent = (req, res) => {
    const id = req.params.id;

    const sql = "DELETE FROM students WHERE id = ?";

    db.query(sql, [id], (err, result) => {
        if (err) {
            return res.status(500).json({
                message: "Database error",
                error: err
            });
        }

        if (result.affectedRows === 0) {
            return res.status(404).json({
                message: "Student not found"
            });
        }

        res.json({
            message: "Student deleted successfully"
        });
    });
};
// SEARCH STUDENTS
const searchStudents = (req, res) => {
    const { id, name, department } = req.query;

    let sql = "SELECT * FROM students WHERE 1=1";
    const values = [];

    // Search by student ID
    if (id) {
        sql += " AND id = ?";
        values.push(id);
    }

    // Search by student name
    if (name) {
        sql += " AND name LIKE ?";
        values.push(`%${name}%`);
    }

    // Search by department
    if (department) {
        sql += " AND department LIKE ?";
        values.push(`%${department}%`);
    }
    if (req.query.semester) {
    sql += " AND semester = ?";
    values.push(req.query.semester);
}

    sql += " ORDER BY id DESC";

    db.query(sql, values, (err, results) => {
        if (err) {
            console.error("Database error:", err);

            return res.status(500).json({
                message: "Database error"
            });
        }

        res.status(200).json(results);
    });
};

module.exports = {
    getAllStudents,
    getStudentById,
    createStudent,
    updateStudent,
    deleteStudent,
    searchStudents
};