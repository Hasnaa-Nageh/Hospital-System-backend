const Patient = require("./../models/patient.model");

const addPatient = async (req, res, next) => {
  try {
    const { fullname, phone, dateOfBirth, gender, address, notes } = req.body;

    if (!fullname || !phone || !dateOfBirth || !gender) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const exist = await Patient.findOne({ phone });

    if (exist) {
      return res.status(409).json({ message: "Patient already exists" });
    }

    const patient = await Patient.create({
      fullname,
      phone,
      dateOfBirth,
      gender,
      address,
      notes,
      createdBy: req.user.id,
    });
    res.status(201).json({ message: "Patient added successfully", patient });
  } catch (err) {
    console.log(err);
    next(err);
  }
};

const getAllPatient = async (req, res, next) => {
  try {
    const patients = await Patient.find().sort({ createdAt: -1 });
    if (!patients) {
      return res.status(400).json({ message: "No patient found" });
    }
    res.status(200).json({ patients });
  } catch (err) {
    console.log(err);
    next(err);
  }
};

const getSinglePatient = async (req, res, next) => {
  try {
    const { id } = req.params;
    const patient = await Patient.findById(id);
    if (!patient) {
      return res.status(404).json({ message: "Patient not found" });
    }
    res.status(200).json({ patient });
  } catch (err) {
    console.log(err);
    next(err);
  }
};

const searchPatient = async (req, res, next) => {
  try {
    const { query } = req.query;
    if (!query) {
      return res.status(400).json({ message: "Search query is required" });
    }
    const patients = await Patient.find({
      $or: [
        { fullname: { $regex: query, $options: "i" } },
        { phone: { $regex: query, $options: "i" } },
      ],
    });

    res.status(200).json({ patients });
  } catch (err) {
    console.log(err);
    next(err);
  }
};

const updatePatient = async (req, res, next) => {
  try {
    const { id } = req.params;

    const patient = await Patient.findByIdAndUpdate(id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!patient) {
      return res.status(404).json({ message: "Patient not found" });
    }

    res.status(200).json({ message: "Patient updated", patient });
  } catch (err) {
    console.log(err);
    next(err);
  }
};

const deletePatient = async (req, res, next) => {
  try {
    const { id } = req.params;

    const patient = await Patient.findByIdAndDelete(id);
    if (!patient) {
      return res.status(404).json({ message: "Patient not found" });
    }

    res.status(200).json({ message: "Patient deleted" });
  } catch (err) {
    console.log(err);
    next(err);
  }
};
module.exports = {
  getAllPatient,
  getSinglePatient,
  addPatient,
  deletePatient,
  updatePatient,
  searchPatient,
};
