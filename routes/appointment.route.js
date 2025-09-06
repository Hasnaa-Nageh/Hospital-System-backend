const express = require("express");
const {
  addAppointment,
  getAllAppointments,
  getPatientAppointments,
  deleteAppointment,
  updateAppointment,
  getDoctorAppointments,
  getMyAppointments,
} = require("../controllers/appointment.controller");
const validate = require("../middleware/validate.middleware");
const {
  createAppointmentSchema,
} = require("../validation/appointment.validation");
const { authenticateToken } = require("../middleware/auth.middleware");
const authorizeRole = require("../middleware/authorize.middleware");
const router = express.Router();

router.post(
  "/",
  validate(createAppointmentSchema),
  authenticateToken,
  authorizeRole("patient", "admin", "reception"),
  addAppointment
);
router.get(
  "/",
  authenticateToken,
  authorizeRole("admin", "reception"),
  getAllAppointments
);
router.get(
  "/patient/:patientId",
  authenticateToken,
  authorizeRole("admin", "reception", "patient"),
  getPatientAppointments
);

router.get(
  "/doctor/:doctorId",
  authenticateToken,
  authorizeRole("admin", "doctor"),
  getDoctorAppointments
);

router.get("/my", authenticateToken, getMyAppointments);

router.put(
  "/:id",
  authenticateToken,
  authorizeRole("admin", "reception"),
  updateAppointment
);

router.delete(
  "/:id",
  authenticateToken,
  authorizeRole("admin"),
  deleteAppointment
);
module.exports = router;
