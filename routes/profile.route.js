const { authenticateToken } = require("../middleware/auth.middleware");
const express = require("express");
const router = express.Router();

// Profile
const {
  getProfile,
  updateProfile,
  deleteProfile,
} = require("./../controllers/profile.controller");

// Profile routes
router.get("/", authenticateToken, getProfile);
router.put("/", authenticateToken, updateProfile);
router.delete("/", authenticateToken, deleteProfile);


module.exports = router;