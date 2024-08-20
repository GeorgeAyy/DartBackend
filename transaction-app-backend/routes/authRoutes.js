// routes/authRoutes.js

const express = require("express");
const {
  loginUser,
  logoutUser,
  checkAuth,
  register,
} = require("../controllers/authController");

const router = express.Router();

router.post(
  "/login",
  (req, res, next) => {
    console.log("POST /auth/login - Request received with body:", req.body);
    next();
  },
  loginUser
);

router.post(
  "/register",
  (req, res, next) => {
    console.log("POST /auth/register - Request received with body:", req.body);
    next();
  },
  register
);

router.post(
  "/logout",
  (req, res, next) => {
    console.log("POST /auth/logout - Request received");
    next();
  },
  logoutUser
);

router.get(
  "/check-auth",
  (req, res, next) => {
    console.log("GET /auth/check-auth - Request received");
    next();
  },
  checkAuth
);

module.exports = router;
