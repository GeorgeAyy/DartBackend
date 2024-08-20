// controllers/authController.js

const User = require("../models/User");

const loginUser = async (req, res) => {
  console.log("loginUser called with data:", req.body);
  const { username, password } = req.body;

  try {
    const user = await User.findOne({ username });
    console.log("User found:", user);

    if (user && (await user.matchPassword(password))) {
      req.session.userId = user._id; // Save user ID in session
      console.log("Login successful, session saved with userId:", user._id);
      res.json({ message: "Login successful" });
    } else {
      console.log("Invalid credentials");
      res.status(401).json({ message: "Invalid credentials" });
    }
  } catch (error) {
    console.error("Error during login:", error.message);
    res.status(500).json({ message: error.message });
  }
};

const logoutUser = (req, res) => {
  console.log("logoutUser called");
  req.session.destroy((err) => {
    if (err) {
      console.error("Failed to log out:", err);
      return res.status(500).json({ message: "Failed to log out" });
    }
    res.clearCookie("connect.sid"); // Clear the session cookie
    console.log("Logged out successfully");
    res.json({ message: "Logged out successfully" });
  });
};

// Add this function to check if the user is authenticated
const checkAuth = (req, res) => {
  console.log("checkAuth called, session userId:", req.session.userId);
  if (req.session.userId) {
    res.json({ authenticated: true });
  } else {
    console.log("User not authenticated");
    res.status(401).json({ authenticated: false });
  }
};

const register = async (req, res) => {
  console.log("register called with data:", req.body);
  const { username, password } = req.body;

  try {
    const userExists = await User.findOne({ username });
    console.log("User existence check:", userExists);

    if (userExists) {
      console.log("User already exists");
      return res.status(400).json({ message: "User already exists" });
    }

    const user = await User.create({ username, password });
    console.log("User created:", user);

    req.session.userId = user._id; // Save user ID in session
    console.log("Session saved with userId:", user._id);

    res.status(201).json({ message: "User created" });
  } catch (error) {
    console.error("Error during registration:", error.message);
    res.status(500).json({ message: error.message });
  }
};

module.exports = { loginUser, logoutUser, checkAuth, register };
