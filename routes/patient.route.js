const express = require("express");
const router = express.Router();

const {
  getAllPatient,
  getSinglePatient,
  addPatient,
  deletePatient,
  updatePatient,
  searchPatient,
} = require("./../controllers/patient.controller");
const { authenticateToken } = require("../middleware/auth.middleware");
const authorizeRole = require("../middleware/authorize.middleware");

router.get(
  "/",
  authenticateToken,
  authorizeRole("doctor", "reception", "admin"),
  getAllPatient
);

router.get(
  "/search",
  authenticateToken,
  authorizeRole("doctor", "reception", "admin"),
  searchPatient
);

router.get(
  "/:id",
  authenticateToken,
  authorizeRole("doctor", "reception", "admin"),
  getSinglePatient
);

router.post(
  "/",
  authenticateToken,
  authorizeRole("doctor", "reception", "admin"),
  addPatient
);

router.put(
  "/:id",
  authenticateToken,
  authorizeRole("doctor", "reception", "admin"),
  updatePatient
);
router.delete("/:id", authenticateToken, authorizeRole("admin"), deletePatient);

module.exports = router;
