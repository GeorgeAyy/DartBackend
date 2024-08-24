const express = require("express");
const cors = require("cors");
const session = require("express-session");
const dotenv = require("dotenv");
const connectDB = require("./config/db");
const authRoutes = require("./routes/authRoutes");
const transactionRoutes = require("./routes/transactionRoutes");
const categoryRoutes = require("./routes/categoryRoutes");
const dashboardRoutes = require("./routes/dashboardRoutes");
const { protect } = require("./middleware/authMiddleware");

dotenv.config();

connectDB();

const app = express();

// Enable CORS for all requests
app.use(
  cors({
    origin: "http://localhost:3000", // React app's address
    credentials: true, // Allow credentials (cookies, authorization headers, etc.)
  })
);

app.use(express.json());

app.use(
  session({
    secret: process.env.SESSION_SECRET || "yourSecretKey",
    resave: false,
    saveUninitialized: false,
    cookie: {
      maxAge: 1000 * 60 * 60 * 24, // 1 day
      secure: false, // Set to true if using HTTPS
      httpOnly: true,
    },
  })
);

app.use("/api/auth", authRoutes);
app.use("/api/transactions", protect, transactionRoutes);
app.use("/api/categories", protect, categoryRoutes);
app.use("/api/dashboard", protect, dashboardRoutes);
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
