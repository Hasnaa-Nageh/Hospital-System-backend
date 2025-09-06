const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const userSchema = new mongoose.Schema(
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
      trim: true,
    },
    password: { type: String, required: true },
    role: {
      type: String,
      enum: ["admin", "doctor", "reception", "patient"],
      required: true,
    },
    isActive: { type: Boolean, default: true },
    refreshToken: {
      type: String,
      default: null,
    },
    passwordChangeAt: {
      // ADD THIS FIELD
      type: Date,
      default: null,
    },
    patientProfile: {
      type: mongoose.Schema.ObjectId,
      ref: "patient",
      default: null,
    },
    doctorProfile: {
      type: mongoose.Schema.ObjectId,
      ref: "doctor",
      default: null,
    },
  },
  { timestamps: true }
);

// Hash password
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();

  try {
    this.password = await bcrypt.hash(this.password, 12);

    // Set passwordChangeAt when password is modified (but not on initial creation)
    if (!this.isNew) {
      this.passwordChangeAt = Date.now();
    }

    next();
  } catch (error) {
    next(error);
  }
});

module.exports = mongoose.model("user", userSchema);
