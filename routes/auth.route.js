const express = require("express");
const {
  signup,
  login,
  logOut,
  changePassword,
  refreshToken,
} = require("../controllers/auth.controller.js");
const { authenticateToken } = require("../middleware/auth.middleware.js");
const router = express.Router();

router.post("/signup", signup);
router.post("/login", login);
router.post("/logout", logOut);
router.post("/change-password", authenticateToken, changePassword);
router.post("/refresh-token", refreshToken);

module.exports = router;
