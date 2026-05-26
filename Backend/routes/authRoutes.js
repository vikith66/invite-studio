const express = require("express");
const router = express.Router();
const { registerUser, loginUser } = require("../controllers/authController");

// @route   POST /api/auth/signup
router.post("/signup", registerUser);

// @route   POST /api/auth/login
router.post("/login", loginUser);

module.exports = router;
