// middleware/authMiddleware.js

const User = require("../models/User");

const protect = async (req, res, next) => {
  if (!req.session.userId) {
    return res.status(401).json({ message: "Not authorized, no session" });
  }

  try {
    const user = await User.findById(req.session.userId).select("-password");
    if (!user) {
      return res.status(401).json({ message: "User not found" });
    }
    req.user = user;
    next();
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { protect };
