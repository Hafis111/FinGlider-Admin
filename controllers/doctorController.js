const Doctor = require("../models/doctor");
const DoctorAvailability = require("../models/doctorAvailability");
const Department = require("../models/department");

// Controller to create doctor with availability
const createDoctorAvailability = async (req, res) => {
  const { name, departmentId, availableDaysAndTime, status = true } = req.body; // Include status with a default value

  if (!name || !departmentId || !availableDaysAndTime) {
    return res.status(400).json({
      success: false,
      message: "Doctor name, department ID, and availability are required.",
    });
  }

  try {
    // Create the doctor record
    const doctor = await Doctor.create({
      name,
      departmentId,
      status, // Include status when creating a doctor
    });

    // Create availability records for the doctor
    const availabilityPromises = Object.keys(availableDaysAndTime).map((day) =>
      DoctorAvailability.create({
        doctorId: doctor.id,
        day,
        timeRange: availableDaysAndTime[day].timeRange,
        availableSlots: availableDaysAndTime[day].availableSlots,
      })
    );

    await Promise.all(availabilityPromises);

    res.status(201).json({
      success: true,
      message: "Doctor created successfully with availability.",
      doctor,
    });
  } catch (err) {
    console.error("Error creating doctor availability:", err.message);
    res.status(500).json({ success: false, error: err.message });
  }
};

// Controller to update doctor availability
const updateDoctorAvailability = async (req, res) => {
  const { id } = req.params;
  const { availableDaysAndTime } = req.body;

  if (!availableDaysAndTime) {
    return res.status(400).json({
      success: false,
      message: "Doctor availability is required.",
    });
  }

  try {
    const doctor = await Doctor.findByPk(id);

    if (!doctor) {
      return res.status(404).json({
        success: false,
        message: "Doctor not found.",
      });
    }

    // Update availability records
    const availabilityPromises = Object.keys(availableDaysAndTime).map((day) =>
      DoctorAvailability.upsert({
        doctorId: doctor.id,
        day,
        timeRange: availableDaysAndTime[day].timeRange,
        availableSlots: availableDaysAndTime[day].availableSlots,
      })
    );

    // Wait for all availability records to be updated
    await Promise.all(availabilityPromises);

    res.status(200).json({
      success: true,
      message: "Doctor availability updated successfully.",
      doctor,
    });
  } catch (err) {
    console.error("Error updating doctor availability:", err.message);
    res.status(500).json({ success: false, error: err.message });
  }
};

// Controller to get all doctors
const getAllDoctors = async (req, res) => {
  try {
    const doctors = await Doctor.findAll({
      include: [
        {
          model: Department,
          attributes: ["id", "name"], // Include only relevant fields
        },
        {
          model: DoctorAvailability,
          attributes: ["day", "timeRange", "availableSlots"], // Include availability details
        },
      ],
    });

    res.status(200).json({
      success: true,
      message: "Doctors fetched successfully.",
      doctors,
    });
  } catch (err) {
    console.error("Error fetching doctors:", err.message);
    res.status(500).json({ success: false, error: err.message });
  }
};

// Controller to delete a doctor
const deleteDoctor = async (req, res) => {
  const { id } = req.params;

  try {
    const doctor = await Doctor.findByPk(id);

    if (!doctor) {
      return res.status(404).json({
        success: false,
        message: "Doctor not found.",
      });
    }

    // Delete the doctor availability records first to maintain referential integrity
    await DoctorAvailability.destroy({
      where: { doctorId: id },
    });

    // Delete the doctor record
    await doctor.destroy();

    res.status(200).json({
      success: true,
      message: "Doctor and their availability deleted successfully.",
    });
  } catch (err) {
    console.error("Error deleting doctor:", err.message);
    res.status(500).json({ success: false, error: err.message });
  }
};
const updateDoctorStatus = async (req, res) => {
  const { id } = req.params; // Doctor ID from the route parameter
  const { status } = req.body; // New status from the request body

  // Validate the request body
  if (status === undefined) {
    return res.status(400).json({
      success: false,
      message: "Doctor status is required.",
    });
  }

  try {
    // Find the doctor by ID
    const doctor = await Doctor.findByPk(id);

    if (!doctor) {
      return res.status(404).json({
        success: false,
        message: "Doctor not found.",
      });
    }

    // Update the status field
    doctor.status = status;
    await doctor.save();

    res.status(200).json({
      success: true,
      message: "Doctor status updated successfully.",
      doctor,
    });
  } catch (err) {
    console.error("Error updating doctor status:", err.message);
    res.status(500).json({ success: false, error: err.message });
  }
};

module.exports = {
  createDoctorAvailability,
  updateDoctorAvailability,
  getAllDoctors,
  deleteDoctor,
  updateDoctorStatus,
};
