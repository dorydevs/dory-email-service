require("dotenv").config();
const emailService = require("./src/services/email.service");

async function testEmailService() {
  try {
    console.log("Testing email service...");

    // Example email data
    const to = "dorydevelopers@gmail.com"; // Replace with your real recipient email
    const subject = "Test Email from Dory Email Service";
    const templateName = "welcome"; // Using the welcome template
    const data = {
      name: "Test User",
      message:
        "This is a test email to verify the email service is working correctly!",
    };

    // Optional parameters
    const options = {
      // cc: 'cc@example.com',
      // bcc: 'bcc@example.com',
    };

    // Verify SMTP connection first
    console.log("Verifying SMTP connection...");
    const connected = await emailService.verifyConnection();

    if (!connected) {
      console.error(
        "Failed to connect to SMTP server. Check your .env configuration."
      );
      return;
    }

    console.log("SMTP connection successful. Sending test email...");

    // Send the email
    const result = await emailService.sendEmailWithTemplate(
      to,
      subject,
      templateName,
      data,
      options
    );

    console.log("Email sent successfully!");
    console.log("Message ID:", result.messageId);
  } catch (error) {
    console.error("Error sending test email:", error);
  }
}

testEmailService();
