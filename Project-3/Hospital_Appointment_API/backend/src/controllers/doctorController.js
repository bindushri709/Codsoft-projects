const Doctor = require("../models/Doctor");
const User = require("../models/User");

// Create doctor profile
const createDoctorProfile = async (req, res) => {
  try {
    const {
      specialization,
      department,
      phone,
      experience
    } = req.body;

    // Check if doctor profile already exists
    const existingDoctor = await Doctor.findOne({
      user: req.user.id
    });

    if (existingDoctor) {
      return res.status(400).json({
        message: "Doctor profile already exists"
      });
    }

    const doctor = await Doctor.create({
      user: req.user.id,
      specialization,
      department,
      phone,
      experience
    });

    res.status(201).json({
      message: "Doctor profile created successfully",
      doctor
    });
  } catch (error) {
    res.status(500).json({
      message: "Server error",
      error: error.message
    });
  }
};


// Get logged-in doctor's profile
const getMyDoctorProfile = async (req, res) => {
  try {
    const doctor = await Doctor.findOne({
      user: req.user.id
    })
      .populate("user", "name email role")
      .populate("specialization", "name description")
      .populate("department", "name description");

    if (!doctor) {
      return res.status(404).json({
        message: "Doctor profile not found"
      });
    }

    res.json({
      doctor
    });
  } catch (error) {
    res.status(500).json({
      message: "Server error",
      error: error.message
    });
  }
};


// Get all doctors with search and filtering
const getAllDoctors = async (req, res) => {
  try {
    const {
      name,
      specialization,
      department
    } = req.query;

    let filter = {};

    // ==========================================
    // FILTER BY SPECIALIZATION
    // ==========================================

    if (specialization) {
      filter.specialization = specialization;
    }

    // ==========================================
    // FILTER BY DEPARTMENT
    // ==========================================

    if (department) {
      filter.department = department;
    }

    // ==========================================
    // SEARCH BY DOCTOR NAME
    // ==========================================

    if (name) {
      const users = await User.find({
        name: {
          $regex: name,
          $options: "i"
        },
        role: "doctor"
      }).select("_id");

      const userIds = users.map(
        (user) => user._id
      );

      filter.user = {
        $in: userIds
      };
    }

    // ==========================================
    // GET DOCTORS
    // ==========================================

    const doctors = await Doctor.find(filter)
      .populate(
        "user",
        "name email role"
      )
      .populate(
        "specialization",
        "name description"
      )
      .populate(
        "department",
        "name description"
      );

    res.status(200).json({
      count: doctors.length,
      doctors
    });

  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Server error",
      error: error.message
    });
  }
};


module.exports = {
  createDoctorProfile,
  getMyDoctorProfile,
  getAllDoctors
};