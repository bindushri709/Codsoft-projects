const Availability = require("../models/Availability");
const Doctor = require("../models/Doctor");

// ===============================
// CREATE AVAILABILITY SLOT
// ===============================

const createAvailability = async (req, res) => {
  try {
    const { date, startTime, endTime } = req.body;

    // -----------------------------
    // Required fields validation
    // -----------------------------

    if (!date || !startTime || !endTime) {
      return res.status(400).json({
        message: "Date, start time and end time are required",
      });
    }

    // -----------------------------
    // Validate time format
    // Expected: HH:MM
    // -----------------------------

    const timeRegex = /^([01]\d|2[0-3]):([0-5]\d)$/;

    if (!timeRegex.test(startTime) || !timeRegex.test(endTime)) {
      return res.status(400).json({
        message: "Invalid time format. Please use HH:MM",
      });
    }

    // -----------------------------
    // Check start time < end time
    // -----------------------------

    const startMinutes =
      parseInt(startTime.split(":")[0]) * 60 +
      parseInt(startTime.split(":")[1]);

    const endMinutes =
      parseInt(endTime.split(":")[0]) * 60 +
      parseInt(endTime.split(":")[1]);

    if (startMinutes >= endMinutes) {
      return res.status(400).json({
        message: "End time must be later than start time",
      });
    }

    // -----------------------------
    // Convert date to YYYY-MM-DD
    // -----------------------------

    const parsedDate = new Date(date);

    if (isNaN(parsedDate.getTime())) {
      return res.status(400).json({
        message: "Invalid date format. Please use YYYY-MM-DD",
      });
    }

    const formattedDate = parsedDate.toISOString().split("T")[0];

    // -----------------------------
    // Calculate day of week
    // -----------------------------

    const dayOfWeek = new Date(
      `${formattedDate}T00:00:00Z`
    ).toLocaleDateString("en-US", {
      weekday: "long",
      timeZone: "UTC",
    });

    // -----------------------------
    // Find logged-in doctor's profile
    // -----------------------------

    const doctor = await Doctor.findOne({
      user: req.user.id,
    });

    if (!doctor) {
      return res.status(404).json({
        message: "Doctor profile not found",
      });
    }

    // -----------------------------
    // Check duplicate availability
    // -----------------------------

    const existingAvailability = await Availability.findOne({
      doctor: doctor._id,
      date: formattedDate,
      startTime,
      endTime,
    });

    if (existingAvailability) {
      return res.status(400).json({
        message: "This availability slot already exists",
      });
    }

    // -----------------------------
    // Create availability
    // -----------------------------

    const availability = await Availability.create({
      doctor: doctor._id,
      date: formattedDate,
      dayOfWeek,
      startTime,
      endTime,
      isBooked: false,
    });

    // -----------------------------
    // Response
    // -----------------------------

    res.status(201).json({
      message: "Availability created successfully",
      availability,
    });
  } catch (error) {
    console.error("Create availability error:", error);

    res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
};


// ===============================
// GET AVAILABILITY SLOTS
// ===============================

const getAvailability = async (req, res) => {
  try {
    const { doctorId, date } = req.query;

    const filter = {};

    if (doctorId) {
      filter.doctor = doctorId;
    }

    if (date) {
      filter.date = date;
    }

    const availability = await Availability.find(filter)
      .populate({
        path: "doctor",
        populate: [
          {
            path: "user",
            select: "name email",
          },
          {
            path: "specialization",
            select: "name",
          },
          {
            path: "department",
            select: "name",
          },
        ],
      })
      .sort({
        date: 1,
        startTime: 1,
      });

    res.json({
      availability,
    });
  } catch (error) {
    console.error("Get availability error:", error);

    res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
};


// ===============================
// DELETE AVAILABILITY SLOT
// ===============================

const deleteAvailability = async (req, res) => {
  try {
    const { id } = req.params;

    // -----------------------------
    // Find logged-in doctor's profile
    // -----------------------------

    const doctor = await Doctor.findOne({
      user: req.user.id,
    });

    if (!doctor) {
      return res.status(404).json({
        message: "Doctor profile not found",
      });
    }

    // -----------------------------
    // Find availability
    // -----------------------------

    const availability = await Availability.findById(id);

    if (!availability) {
      return res.status(404).json({
        message: "Availability slot not found",
      });
    }

    // -----------------------------
    // Check ownership
    // -----------------------------

    if (
      availability.doctor.toString() !==
      doctor._id.toString()
    ) {
      return res.status(403).json({
        message:
          "You are not authorized to delete this availability",
      });
    }

    // -----------------------------
    // Don't delete booked slot
    // -----------------------------

    if (availability.isBooked) {
      return res.status(400).json({
        message: "Booked availability cannot be deleted",
      });
    }

    // -----------------------------
    // Delete availability
    // -----------------------------

    await Availability.findByIdAndDelete(id);

    res.json({
      message: "Availability deleted successfully",
    });
  } catch (error) {
    console.error("Delete availability error:", error);

    res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
};


// ===============================
// EXPORT
// ===============================

module.exports = {
  createAvailability,
  getAvailability,
  deleteAvailability,
};