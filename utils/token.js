require("dotenv").config();
const jwt = require("jsonwebtoken");

// Generate Access Token
const generateAccessToken = (user) => {
  const payload = {
    id: user._id,
    role: user.role,
  };
  const secretKey = process.env.JWT_ACCESS_SECRET;
  const options = { expiresIn: process.env.ACCESS_TOKEN_EXPIRES || "1h" };
  return jwt.sign(payload, secretKey, options);
};

// Generate Refresh Token
const generateRefreshToken = (user) => {
  const payload = {
    id: user._id,
    role: user.role,
  };
  const secretKey = process.env.JWT_REFRESH_SECRET;
  const options = { expiresIn: process.env.REFRESH_TOKEN_EXPIRES || "7d" };
  return jwt.sign(payload, secretKey, options);
};

module.exports = { generateAccessToken, generateRefreshToken };
