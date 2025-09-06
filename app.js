const express = require("express");
const app = express();
const cookieParser = require("cookie-parser");
const authRouter = require("./routes/auth.route.js");
const profileRouter = require("./routes/profile.route.js");
const patientRouter = require("./routes/patient.route.js");
const doctorRoute = require("./routes/doctor.route.js");
const appointmentRouter = require("./routes/appointment.route.js");
app.use(express.json());
app.use(cookieParser());
const path = require("path");
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

app.get("/", (req, res) => {
  res.send("Backend API is running");
});
app.use("/api/auth", authRouter);
app.use("/api/profile", profileRouter);
app.use("/api/patient", patientRouter);
app.use("/api/doctor", doctorRoute);
app.use("/api/appointment", appointmentRouter);

module.exports = app;
