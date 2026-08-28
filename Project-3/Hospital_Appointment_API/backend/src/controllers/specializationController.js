const Specialization = require("../models/Specialization");

// Create specialization
const createSpecialization = async (req, res) => {
  try {
    const { name, description } = req.body;

    if (!name) {
      return res.status(400).json({
        message: "Specialization name is required"
      });
    }

    const existingSpecialization = await Specialization.findOne({ name });

    if (existingSpecialization) {
      return res.status(400).json({
        message: "Specialization already exists"
      });
    }

    const specialization = await Specialization.create({
      name,
      description
    });

    res.status(201).json({
      message: "Specialization created successfully",
      specialization
    });
  } catch (error) {
    res.status(500).json({
      message: "Server error",
      error: error.message
    });
  }
};

// Get all specializations
const getSpecializations = async (req, res) => {
  try {
    const specializations = await Specialization.find();

    res.json({
      specializations
    });
  } catch (error) {
    res.status(500).json({
      message: "Server error",
      error: error.message
    });
  }
};

module.exports = {
  createSpecialization,
  getSpecializations
};