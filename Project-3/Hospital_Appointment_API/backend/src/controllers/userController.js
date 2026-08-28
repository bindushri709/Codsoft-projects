const User = require("../models/User");
const Patient = require("../models/Patient");
const Doctor = require("../models/Doctor");
const Department = require("../models/Department");
const Specialization = require("../models/Specialization");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

// =====================================================
// REGISTER USER
// =====================================================

const registerUser = async (req, res) => {
  try {
    const {
      name,
      email,
      password,
      role,
      specialization,
      department,
      phone,
      experience,
      dateOfBirth,
      gender,
      address
    } = req.body;

    // =====================================================
    // BASIC VALIDATION
    // =====================================================

    if (!name || !email || !password) {
      return res.status(400).json({
        message: "Name, email and password are required"
      });
    }

    // =====================================================
    // CHECK EXISTING USER
    // =====================================================

    const existingUser = await User.findOne({
      email: email.trim().toLowerCase()
    });

    if (existingUser) {
      return res.status(400).json({
        message: "User already exists"
      });
    }

    // =====================================================
    // VALIDATE ROLE
    // =====================================================

    const selectedRole = role || "patient";

    if (
      selectedRole !== "patient" &&
      selectedRole !== "doctor"
    ) {
      return res.status(400).json({
        message: "Invalid role"
      });
    }

    // =====================================================
    // DOCTOR VALIDATION
    // =====================================================

    if (selectedRole === "doctor") {
      if (!specialization || !specialization.trim()) {
        return res.status(400).json({
          message: "Specialization is required for doctor registration"
        });
      }

      if (!department || !department.trim()) {
        return res.status(400).json({
          message: "Department is required for doctor registration"
        });
      }
    }

    // =====================================================
    // HASH PASSWORD
    // =====================================================

    const hashedPassword = await bcrypt.hash(password, 10);

    // =====================================================
    // CREATE USER
    // =====================================================

    const user = await User.create({
      name: name.trim(),
      email: email.trim().toLowerCase(),
      password: hashedPassword,
      role: selectedRole
    });

    // =====================================================
    // AUTOMATIC PATIENT PROFILE
    // =====================================================

    if (selectedRole === "patient") {
      const patient = await Patient.create({
        user: user._id,
        dateOfBirth: dateOfBirth || undefined,
        gender: gender || undefined,
        phone: phone || "",
        address: address || ""
      });

      return res.status(201).json({
        message: "Patient registered successfully",

        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          role: user.role
        },

        patient
      });
    }

    // =====================================================
    // AUTOMATIC DOCTOR PROFILE
    // =====================================================

    if (selectedRole === "doctor") {

      // ---------------------------------------------------
      // CLEAN SPECIALIZATION AND DEPARTMENT
      // ---------------------------------------------------

      const specializationName =
        specialization.trim();

      const departmentName =
        department.trim();

      // ---------------------------------------------------
      // FIND SPECIALIZATION
      // ---------------------------------------------------

      let specializationRecord =
        await Specialization.findOne({
          name: {
            $regex: `^${specializationName.replace(
              /[.*+?^${}()|[\]\\]/g,
              "\\$&"
            )}$`,
            $options: "i"
          }
        });

      // ---------------------------------------------------
      // CREATE SPECIALIZATION IF IT DOES NOT EXIST
      // ---------------------------------------------------

      if (!specializationRecord) {
        specializationRecord =
          await Specialization.create({
            name: specializationName,
            description:
              `${specializationName} specialization`
          });
      }

      // ---------------------------------------------------
      // FIND DEPARTMENT
      // ---------------------------------------------------

      let departmentRecord =
        await Department.findOne({
          name: {
            $regex: `^${departmentName.replace(
              /[.*+?^${}()|[\]\\]/g,
              "\\$&"
            )}$`,
            $options: "i"
          }
        });

      // ---------------------------------------------------
      // CREATE DEPARTMENT IF IT DOES NOT EXIST
      // ---------------------------------------------------

      if (!departmentRecord) {
        departmentRecord =
          await Department.create({
            name: departmentName,
            description:
              `${departmentName} department`
          });
      }

      // ---------------------------------------------------
      // CREATE DOCTOR PROFILE AUTOMATICALLY
      // ---------------------------------------------------

      const doctor = await Doctor.create({
        user: user._id,
        specialization: specializationRecord._id,
        department: departmentRecord._id,
        phone: phone || "",
        experience: experience || 0
      });

      // ---------------------------------------------------
      // RETURN SUCCESS
      // ---------------------------------------------------

      return res.status(201).json({
        message: "Doctor registered successfully",

        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          role: user.role
        },

        doctor: {
          id: doctor._id,
          specialization: specializationRecord.name,
          department: departmentRecord.name,
          phone: doctor.phone,
          experience: doctor.experience
        }
      });
    }

  } catch (error) {

    console.error("Registration error:", error);

    res.status(500).json({
      message: "Server error",
      error: error.message
    });
  }
};


// =====================================================
// LOGIN USER
// =====================================================

const loginUser = async (req, res) => {
  try {

    const { email, password } = req.body;

    // =====================================================
    // VALIDATION
    // =====================================================

    if (!email || !password) {
      return res.status(400).json({
        message: "Email and password are required"
      });
    }

    // =====================================================
    // FIND USER
    // =====================================================

    const user = await User.findOne({
      email: email.trim().toLowerCase()
    });

    if (!user) {
      return res.status(401).json({
        message: "Invalid email or password"
      });
    }

    // =====================================================
    // CHECK PASSWORD
    // =====================================================

    const isPasswordCorrect =
      await bcrypt.compare(
        password,
        user.password
      );

    if (!isPasswordCorrect) {
      return res.status(401).json({
        message: "Invalid email or password"
      });
    }

    // =====================================================
    // CREATE JWT
    // =====================================================

    const token = jwt.sign(
      {
        id: user._id,
        role: user.role
      },

      process.env.JWT_SECRET ||
        "hospital_secret_key",

      {
        expiresIn: "1d"
      }
    );

    // =====================================================
    // LOGIN RESPONSE
    // =====================================================

    res.json({
      message: "Login successful",

      token,

      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    });

  } catch (error) {

    console.error("Login error:", error);

    res.status(500).json({
      message: "Server error",
      error: error.message
    });
  }
};


// =====================================================
// EXPORT
// =====================================================

module.exports = {
  registerUser,
  loginUser
};