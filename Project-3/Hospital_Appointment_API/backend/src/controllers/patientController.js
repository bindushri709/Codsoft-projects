const Patient = require("../models/Patient");

// Create patient profile
const createPatientProfile = async (req, res) => {
  try {
    const { dateOfBirth, gender, phone, address } = req.body;

    // Check if patient profile already exists
    const existingPatient = await Patient.findOne({
      user: req.user.id
    });

    if (existingPatient) {
      return res.status(400).json({
        message: "Patient profile already exists"
      });
    }

    const patient = await Patient.create({
      user: req.user.id,
      dateOfBirth,
      gender,
      phone,
      address
    });

    res.status(201).json({
      message: "Patient profile created successfully",
      patient
    });
  } catch (error) {
    res.status(500).json({
      message: "Server error",
      error: error.message
    });
  }
};

// Get logged-in patient's profile
const getMyPatientProfile = async (req, res) => {
  try {
    const patient = await Patient.findOne({
      user: req.user.id
    }).populate("user", "name email role");

    if (!patient) {
      return res.status(404).json({
        message: "Patient profile not found"
      });
    }

    res.json({
      patient
    });
  } catch (error) {
    res.status(500).json({
      message: "Server error",
      error: error.message
    });
  }
};

module.exports = {
  createPatientProfile,
  getMyPatientProfile
};