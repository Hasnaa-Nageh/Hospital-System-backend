const mongoose = require("mongoose");

const doctorSchema = new mongoose.Schema(
  {
    fullname: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
    },
    phone: {
      type: String,
      required: true,
      unique: true,
    },
    specialization: {
      type: String,
      required: true, // "orthopedic", "emergency", "cardiology"
    },
    availableDays: {
      type: [String], // ["sunday", "monday", ...]
      default: [],
    },
    availableTimes: {
      type: [String], // ["09:00-12:00", "15:00-18:00"]
      default: [],
    },
    notes: {
      type: String,
      default: "",
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
    },
    image: {
      type: String,
      default: "",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("doctor", doctorSchema);
