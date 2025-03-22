const express = require("express");
const dotenv = require("dotenv");
const emailRoutes = require("./routes/email.routes");
const { errorMiddleware } = require("./utils/error-handler");

// Load environment variables from .env file
dotenv.config();

// Create Express app
const app = express();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// API routes
app.use("/api/email", emailRoutes);

// Health check route
app.get("/health", (req, res) => {
  res.status(200).json({ status: "ok" });
});

// Error handling middleware
app.use(errorMiddleware);

// 404 route
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: `Cannot ${req.method} ${req.url}`,
  });
});

module.exports = app;
