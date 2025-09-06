const Patient = require("./../models/patient.model");
const Doctor = require("./../models/doctor.model");
const Appointment = require("./../models/appointment.model");

const addAppointment = async (req, res, next) => {
  try {
    const { doctor, date, notes } = req.body;
    let patientId = req.body.patient;

    if (req.user.role === "patient") {
      if (!req.user.patientProfile) {
        return res.status(400).json({ message: "Patient profile not found" });
      }
      patientId = req.user.patientProfile;
    }

    if (!patientId || !doctor || !date) {
      return res.status(400).json({
        success: false,
        message: "Patient, Doctor and Date are required",
      });
    }

    const patientExist = await Patient.findById(patientId);
    if (!patientExist) {
      return res.status(404).json({ message: "Patient not found" });
    }

    const doctorExist = await Doctor.findById(doctor);
    if (!doctorExist) {
      return res.status(404).json({ success: false, message: "Doctor not found" });
    }

    // نحول التاريخ لـ ISO DateTime عشان نقارن بالساعة والدقيقة
    const appointmentDate = new Date(date);

    // ✅ check: الدكتور عنده ميعاد في نفس الساعة؟
    const doctorConflict = await Appointment.findOne({
      doctor,
      date: appointmentDate,
    });
    if (doctorConflict) {
      return res.status(400).json({
        success: false,
        message: "This doctor already has an appointment at the selected time",
      });
    }

    // ✅ check: المريض عنده ميعاد في نفس الساعة؟
    const patientConflict = await Appointment.findOne({
      patient: patientId,
      date: appointmentDate,
    });
    if (patientConflict) {
      return res.status(400).json({
        success: false,
        message: "You already have an appointment at this time",
      });
    }

    const appointment = await Appointment.create({
      patient: patientId,
      doctor,
      date: appointmentDate,
      notes,
      createdBy: req.user.id,
    });

    res.status(201).json({
      success: true,
      message: "Appointment created successfully",
      data: appointment,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      success: false,
      message: "Internal server error while creating appointment",
      error: err.message,
    });
  }
};

const getAllAppointments = async (req, res, next) => {
  try {
    const appointments = await Appointment.find()
      .populate("patient", "fullname phone")
      .populate("doctor", "fullname specialization")
      .sort({ date: 1 });

    res.status(200).json({
      success: true,
      data: appointments,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      success: false,
      message: "Internal server error while fetching appointments",
      error: err.message,
    });
  }
};

const getPatientAppointments = async (req, res, next) => {
  try {
    const { patientId } = req.params;
    const appointments = await Appointment.find({ patient: patientId })
      .populate("doctor", "fullname specialization")
      .sort({ date: 1 });

    res.status(200).json({
      success: true,
      data: appointments,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      success: false,
      message: "Internal server error while fetching patient appointments",
      error: err.message,
    });
  }
};

const getDoctorAppointments = async (req, res, next) => {
  try {
    const { doctorId } = req.params;
    const appointments = await Appointment.find({ doctor: doctorId })
      .populate("patient", "fullname phone")
      .sort({ date: 1 });

    res.status(200).json({
      success: true,
      data: appointments,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      success: false,
      message: "Internal server error while fetching doctor appointments",
      error: err.message,
    });
  }
};

const updateAppointment = async (req, res, next) => {
  try {
    const { id } = req.params;

    const appointment = await Appointment.findByIdAndUpdate(id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!appointment) {
      return res.status(404).json({
        success: false,
        message: "Appointment not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Appointment updated successfully",
      data: appointment,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      success: false,
      message: "Internal server error while updating appointment",
      error: err.message,
    });
  }
};

const deleteAppointment = async (req, res, next) => {
  try {
    const { id } = req.params;

    const appointment = await Appointment.findByIdAndDelete(id);
    if (!appointment) {
      return res.status(404).json({
        success: false,
        message: "Appointment not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Appointment deleted successfully",
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      success: false,
      message: "Internal server error while deleting appointment",
      error: err.message,
    });
  }
};

const getMyAppointments = async (req, res) => {
  try {
    if (req.user.role !== "patient") {
      return res
        .status(403)
        .json({ success: false, message: "Only patients can access this" });
    }

    const appointments = await Appointment.find({
      patient: req.user.patientProfile,
    })
      .populate("doctor", "fullname specialization")
      .sort({ date: 1 });

    res.status(200).json({ success: true, data: appointments });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      success: false,
      message: "Internal server error while fetching my appointments",
      error: err.message,
    });
  }
};

module.exports = {
  addAppointment,
  getAllAppointments,
  getPatientAppointments,
  getDoctorAppointments,
  updateAppointment,
  deleteAppointment,
  getMyAppointments,
};
