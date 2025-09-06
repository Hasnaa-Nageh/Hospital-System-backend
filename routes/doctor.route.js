const express = require("express");
const router = express.Router();
const {
  addDoctor,
  searchDoctor,
  getAllDoctors,
  deleteDoctor,
  updateDoctor,
  getAvailableSlots,
  getDoctorById,
} = require("./../controllers/doctor.controller");
const { authenticateToken } = require("../middleware/auth.middleware");
const authorizeRole = require("../middleware/authorize.middleware");
const upload = require("../middleware/upload.middleware");
const {
  getDoctorAppointments,
} = require("../controllers/appointment.controller");

router.post(
  "/",
  authenticateToken,
  authorizeRole("admin"),
  upload.single("image"),
  addDoctor
);
router.get(
  "/",
  authenticateToken,
  authorizeRole("admin", "reception"),
  getAllDoctors
);

router.get(
  "/:id",
  authenticateToken,
  authorizeRole("admin", "reception"),
  getDoctorById
);

router.get(
  "/search",
  authenticateToken,
  authorizeRole("admin", "reception"),
  searchDoctor
);

router.get(
  "/:id/available-slots",
  authenticateToken,
  authorizeRole("patient", "reception", "admin"),
  getAvailableSlots
);

router.put("/:id", authenticateToken, authorizeRole("admin"), updateDoctor);
router.delete("/:id", authenticateToken, authorizeRole("admin"), deleteDoctor);

module.exports = router;
