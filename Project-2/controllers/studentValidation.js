const { body, validationResult } = require("express-validator");

const studentValidation = [
    body("name")
        .trim()
        .notEmpty()
        .withMessage("Name is required"),

    body("email")
        .trim()
        .notEmpty()
        .withMessage("Email is required")
        .isEmail()
        .withMessage("Enter a valid email"),

    body("department")
        .trim()
        .notEmpty()
        .withMessage("Department is required"),

    body("semester")
        .notEmpty()
        .isInt({ min: 1, max: 8 })
        .withMessage("Semester must be between 1 and 8"),

    (req, res, next) => {
        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            return res.status(400).json({
                errors: errors.array()
            });
        }

        next();
    }
];

module.exports = studentValidation;