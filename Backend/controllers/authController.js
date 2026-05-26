const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

// Helper function to generate JWT
const generateToken = (id) => {
  try {
    const token = jwt.sign({ id }, process.env.JWT_SECRET, {
      expiresIn: "30d",
    });
    console.log(`JWT generation success for user ID: ${id}`);
    return token;
  } catch (error) {
    console.error(`JWT generation failure for user ID: ${id}:`, error.message);
    throw error;
  }
};

// @desc    Register a new user
// @route   POST /api/auth/signup
// @access  Public
const registerUser = async (req, res) => {
  console.log(`Incoming signup request for: ${req.body ? req.body.email : "undefined"}`);
  try {
    const { name, email, password } = req.body;

    // Simple validation
    if (!name || !email || !password) {
      console.log(`Signup failed: Missing fields for email: ${email}`);
      return res.status(400).json({ message: "Please fill in all fields" });
    }

    // Check if user already exists
    const userExists = await User.findOne({ email });
    if (userExists) {
      console.log(`Signup failed: User with email ${email} already exists`);
      return res.status(400).json({ message: "A user with this email already exists" });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create user
    const user = await User.create({
      name,
      email,
      password: hashedPassword,
    });

    if (user) {
      const token = generateToken(user._id);
      console.log(`Signup success for: ${email}`);
      res.status(201).json({
        token,
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
        },
      });
    } else {
      console.log(`Signup failed: Invalid user data for ${email}`);
      res.status(400).json({ message: "Invalid user data" });
    }
  } catch (error) {
    console.error("Error registering user:", error);
    res.status(500).json({ message: "Server error occurred during registration" });
  }
};

// @desc    Authenticate user & get token
// @route   POST /api/auth/login
// @access  Public
const loginUser = async (req, res) => {
  console.log(`Incoming login request for: ${req.body ? req.body.email : "undefined"}`);
  try {
    const { email, password } = req.body;

    // Simple validation
    if (!email || !password) {
      console.log(`Login failed: Missing email or password`);
      return res.status(400).json({ message: "Please enter email and password" });
    }

    // Find user
    const user = await User.findOne({ email });

    // Verify password
    if (user && (await bcrypt.compare(password, user.password))) {
      const token = generateToken(user._id);
      console.log(`Login success for: ${email}`);
      res.status(200).json({
        token,
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
        },
      });
    } else {
      console.log(`Login failed: Invalid credentials for ${email}`);
      res.status(400).json({ message: "Invalid email or password" });
    }
  } catch (error) {
    console.error("Error logging in user:", error);
    res.status(500).json({ message: "Server error occurred during login" });
  }
};

module.exports = {
  registerUser,
  loginUser,
};
