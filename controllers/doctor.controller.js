const Doctor = require("./../models/doctor.model");
const Appointment = require("./../models/appointment.model");

const fs = require("fs");
const path = require("path");
const {
  createDoctorValidation,
  updateDoctorValidation,
} = require("./../validation/doctor.validation");
const addDoctor = async (req, res, next) => {
  try {
    let {
      fullname,
      email,
      phone,
      specialization,
      availableDays,
      availableTimes,
      notes,
      image,
    } = req.body;

    // ✅ تأكد إن availableDays و availableTimes Arrays
    if (typeof availableDays === "string") {
      try {
        availableDays = JSON.parse(availableDays);
      } catch (e) {
        availableDays = [];
      }
    }

    if (typeof availableTimes === "string") {
      try {
        availableTimes = JSON.parse(availableTimes);
      } catch (e) {
        availableTimes = [];
      }
    }

    let imagePath = "";
    if (image && image.startsWith("data:image")) {
      const base64Data = image.replace(/^data:image\/\w+;base64,/, "");
      const buffer = Buffer.from(base64Data, "base64");
      const filename = `${Date.now()}-${email}.jpg`;
      const uploadPath = path.join(__dirname, "../uploads/doctors", filename);

      fs.writeFileSync(uploadPath, buffer);
      imagePath = `/uploads/doctors/${filename}`;
    }

    const doctor = await Doctor.create({
      fullname,
      email,
      phone,
      specialization,
      availableDays,
      availableTimes,
      notes,
      createdBy: req.user.id,
      image: imagePath,
    });

    res.status(201).json({
      success: true,
      message: "Doctor added successfully",
      doctor,
    });
  } catch (err) {
    console.log(err);
    next(err);
  }
};

const updateDoctor = async (req, res, next) => {
  try {
    const { error } = updateDoctorValidation.validate(req.body);
    if (error) {
      return res
        .status(400)
        .json({ success: false, message: error.details[0].message });
    }

    const { id } = req.params;
    const doctor = await Doctor.findByIdAndUpdate(id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!doctor) {
      return res
        .status(404)
        .json({ success: false, message: "Doctor not found" });
    }

    res.status(200).json({ success: true, message: "Doctor updated", doctor });
  } catch (err) {
    console.log(err);
    next(err);
  }
};

const searchDoctor = async (req, res, next) => {
  try {
    const { query } = req.query;
    if (!query) {
      return res.status(400).json({ message: "Search query is required" });
    }

    const doctors = await Doctor.find({
      $or: [
        { fullname: { $regex: query, $options: "i" } },
        { specialization: { $regex: query, $options: "i" } },
      ],
    });

    res.status(200).json({ doctors });
  } catch (err) {
    console.log(err);
    next(err);
  }
};

const getAllDoctors = async (req, res, next) => {
  try {
    const doctors = await Doctor.find().sort({ fullname: 1 });
    res.status(200).json({ doctors });
  } catch (err) {
    console.log(err);
    next(err);
  }
};

const getDoctorById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const doctor = await Doctor.findById(id);

    if (!doctor) {
      return res
        .status(404)
        .json({ success: false, message: "Doctor not found" });
    }

    res.status(200).json({ success: true, doctor });
  } catch (err) {
    console.error(err);
    next(err);
  }
};

const deleteDoctor = async (req, res, next) => {
  try {
    const { id } = req.params;

    const doctor = await Doctor.findByIdAndDelete(id);
    if (!doctor) {
      return res.status(404).json({ message: "Doctor not found" });
    }

    res.status(200).json({ message: "Doctor deleted" });
  } catch (err) {
    console.log(err);
    next(err);
  }
};

const getAvailableSlots = async (req, res) => {
  try {
    const { id } = req.params;
    const { date } = req.query;

    if (!date) {
      return res
        .status(400)
        .json({ success: false, message: "Date is required" });
    }

    const doctor = await Doctor.findById(id);
    if (!doctor) {
      return res
        .status(404)
        .json({ success: false, message: "Doctor not found" });
    }

    const dayOfWeek = new Date(date).toLocaleDateString("en-US", {
      weekday: "long",
    });
    if (!doctor.availableDays.includes(dayOfWeek)) {
      return res.status(200).json({
        success: true,
        availableSlots: [],
        message: "Doctor not available this day",
      });
    }

    const bookedAppointments = await Appointment.find({
      doctor: id,
      date: { $gte: new Date(date), $lt: new Date(date + "T23:59:59Z") },
    });

    const bookedTimes = bookedAppointments.map((a) =>
      a.date.toLocaleTimeString("en-US", {
        hour: "2-digit",
        minute: "2-digit",
        hour12: true,
      })
    );

    const availableSlots = doctor.availableTimes.filter(
      (time) => !bookedTimes.includes(time)
    );

    res.status(200).json({
      success: true,
      availableSlots,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      success: false,
      message: "Internal server error while fetching available slots",
      error: err.message,
    });
  }
};

module.exports = {
  addDoctor,
  searchDoctor,
  getAllDoctors,
  deleteDoctor,
  updateDoctor,
  getAvailableSlots,
  getDoctorById,
};
