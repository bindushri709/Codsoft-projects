const mongoose = require("mongoose");
const Appointment = require("../models/Appointment");
const Patient = require("../models/Patient");
const Doctor = require("../models/Doctor");
const Availability = require("../models/Availability");

// Book an appointment
const createAppointment = async (req, res) => {
  try {
    const { availability, reason } = req.body;

    if (!availability) {
      return res.status(400).json({
        message: "Availability is required"
      });
    }

    // Validate availability ID
    if (!mongoose.Types.ObjectId.isValid(availability)) {
      return res.status(400).json({
        message: "Invalid availability ID"
      });
    }

    const patient = await Patient.findOne({
      user: req.user.id
    });

    if (!patient) {
      return res.status(404).json({
        message: "Patient profile not found"
      });
    }

    const availabilitySlot = await Availability.findById(availability);

    if (!availabilitySlot) {
      return res.status(404).json({
        message: "Availability slot not found"
      });
    }

    if (availabilitySlot.isBooked) {
      return res.status(400).json({
        message: "This availability slot is already booked"
      });
    }

    const doctor = await Doctor.findById(availabilitySlot.doctor);

    if (!doctor) {
      return res.status(404).json({
        message: "Doctor not found"
      });
    }

    const appointmentDate = new Date(availabilitySlot.date);

    const [hours, minutes] = availabilitySlot.startTime
      .split(":")
      .map(Number);

    appointmentDate.setUTCHours(hours, minutes, 0, 0);

    const appointment = await Appointment.create({
      patient: patient._id,
      doctor: doctor._id,
      department: doctor.department,
      appointmentDate,
      reason,
      status: "pending"
    });

    availabilitySlot.isBooked = true;
    await availabilitySlot.save();

    const populatedAppointment = await Appointment.findById(
      appointment._id
    )
      .populate({
        path: "patient",
        populate: {
          path: "user",
          select: "name email"
        }
      })
      .populate({
        path: "doctor",
        populate: {
          path: "user",
          select: "name email"
        }
      })
      .populate("department");

    res.status(201).json({
      message: "Appointment booked successfully",
      appointment: populatedAppointment
    });
  } catch (error) {
    res.status(500).json({
      message: "Server error",
      error: error.message
    });
  }
};


// Get logged-in patient's appointments with optional status filter
const getMyAppointments = async (req, res) => {
  try {
    const patient = await Patient.findOne({
      user: req.user.id
    });

    if (!patient) {
      return res.status(404).json({
        message: "Patient profile not found"
      });
    }

    const filter = {
      patient: patient._id
    };

    if (req.query.status) {
      const allowedStatuses = [
        "pending",
        "confirmed",
        "cancelled",
        "completed"
      ];

      if (!allowedStatuses.includes(req.query.status)) {
        return res.status(400).json({
          message:
            "Invalid status. Use pending, confirmed, cancelled, or completed"
        });
      }

      filter.status = req.query.status;
    }

    const appointments = await Appointment.find(filter)
      .populate({
        path: "doctor",
        populate: {
          path: "user",
          select: "name email"
        }
      })
      .populate("department");

    res.json({
      count: appointments.length,
      appointments
    });
  } catch (error) {
    res.status(500).json({
      message: "Server error",
      error: error.message
    });
  }
};


// Get doctor's appointments with optional status filter
const getDoctorAppointments = async (req, res) => {
  try {
    const doctor = await Doctor.findOne({
      user: req.user.id
    });

    if (!doctor) {
      return res.status(404).json({
        message: "Doctor profile not found"
      });
    }

    const filter = {
      doctor: doctor._id
    };

    if (req.query.status) {
      const allowedStatuses = [
        "pending",
        "confirmed",
        "cancelled",
        "completed"
      ];

      if (!allowedStatuses.includes(req.query.status)) {
        return res.status(400).json({
          message:
            "Invalid status. Use pending, confirmed, cancelled, or completed"
        });
      }

      filter.status = req.query.status;
    }

    const appointments = await Appointment.find(filter)
      .populate({
        path: "patient",
        populate: {
          path: "user",
          select: "name email"
        }
      })
      .populate("department");

    res.json({
      count: appointments.length,
      appointments
    });
  } catch (error) {
    res.status(500).json({
      message: "Server error",
      error: error.message
    });
  }
};


// Doctor updates appointment status
const updateAppointmentStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const { id } = req.params;

    const allowedStatuses = [
      "confirmed",
      "cancelled",
      "completed"
    ];

    if (!status || !allowedStatuses.includes(status)) {
      return res.status(400).json({
        message:
          "Invalid status. Use confirmed, cancelled, or completed"
      });
    }

    // Validate appointment ID
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        message: "Invalid appointment ID"
      });
    }

    const doctor = await Doctor.findOne({
      user: req.user.id
    });

    if (!doctor) {
      return res.status(404).json({
        message: "Doctor profile not found"
      });
    }

    const appointment = await Appointment.findById(id);

    if (!appointment) {
      return res.status(404).json({
        message: "Appointment not found"
      });
    }

    if (appointment.doctor.toString() !== doctor._id.toString()) {
      return res.status(403).json({
        message: "You are not authorized to update this appointment"
      });
    }

    appointment.status = status;

    await appointment.save();

    const updatedAppointment = await Appointment.findById(
      appointment._id
    )
      .populate({
        path: "patient",
        populate: {
          path: "user",
          select: "name email"
        }
      })
      .populate({
        path: "doctor",
        populate: {
          path: "user",
          select: "name email"
        }
      })
      .populate("department");

    res.json({
      message: "Appointment status updated successfully",
      appointment: updatedAppointment
    });
  } catch (error) {
    res.status(500).json({
      message: "Server error",
      error: error.message
    });
  }
};


// Patient cancels their appointment
const cancelAppointment = async (req, res) => {
  try {
    const { id } = req.params;

    // Validate appointment ID
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        message: "Invalid appointment ID"
      });
    }

    const patient = await Patient.findOne({
      user: req.user.id
    });

    if (!patient) {
      return res.status(404).json({
        message: "Patient profile not found"
      });
    }

    const appointment = await Appointment.findById(id);

    if (!appointment) {
      return res.status(404).json({
        message: "Appointment not found"
      });
    }

    if (appointment.patient.toString() !== patient._id.toString()) {
      return res.status(403).json({
        message: "You are not authorized to cancel this appointment"
      });
    }

    if (appointment.status === "completed") {
      return res.status(400).json({
        message: "Completed appointments cannot be cancelled"
      });
    }

    if (appointment.status === "cancelled") {
      return res.status(400).json({
        message: "Appointment is already cancelled"
      });
    }

    appointment.status = "cancelled";

    await appointment.save();

    res.json({
      message: "Appointment cancelled successfully",
      appointment
    });
  } catch (error) {
    res.status(500).json({
      message: "Server error",
      error: error.message
    });
  }
};


module.exports = {
  createAppointment,
  getMyAppointments,
  getDoctorAppointments,
  updateAppointmentStatus,
  cancelAppointment
};