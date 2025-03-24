const app = require("./app");
const emailService = require("./services/email.service");

// Get port from environment or default to 3000
const PORT = process.env.PORT || 9008;

// Start the server
const server = app.listen(PORT, async () => {
  console.log(`Server running on port ${PORT}`);

  // Verify email connection on startup
  try {
    const connectionVerified = await emailService.verifyConnection();
    if (connectionVerified) {
      console.log("SMTP connection verified successfully");
    } else {
      console.warn(
        "SMTP connection could not be verified - emails may not be sent"
      );
    }
  } catch (error) {
    console.error("Error verifying SMTP connection:", error);
  }
});

// Handle unhandled promise rejections
process.on("unhandledRejection", (err) => {
  console.error("UNHANDLED REJECTION! Shutting down...", err);

  server.close(() => {
    process.exit(1);
  });
});

module.exports = server;
