const http = require("http");
const dotenv = require("dotenv");

// Load environment variables
dotenv.config();

// Get port from .env or default to 3000
const PORT = process.env.PORT || 3000;

// Example email data
const emailData = {
  to: "recipient@example.com", // Replace with your real recipient email
  subject: "Test Email from Dory Email Service API",
  templateName: "welcome",
  data: {
    name: "API Test User",
    message: "This is a test email sent via the API endpoint!",
  },
  options: {
    // cc: 'cc@example.com',
    // bcc: 'bcc@example.com',
  },
};

// Options for the HTTP request
const options = {
  hostname: "localhost",
  port: PORT,
  path: "/api/email/send",
  method: "POST",
  headers: {
    "Content-Type": "application/json",
  },
};

console.log(
  `Sending test email via API endpoint (http://localhost:${PORT}/api/email/send)...`
);

// Make the HTTP request
const req = http.request(options, (res) => {
  let data = "";

  // Collect response data
  res.on("data", (chunk) => {
    data += chunk;
  });

  // Process the complete response
  res.on("end", () => {
    console.log(`Status Code: ${res.statusCode}`);

    try {
      const response = JSON.parse(data);
      console.log("Response:", response);

      if (response.success) {
        console.log("Email sent successfully via API!");
      } else {
        console.error("Failed to send email via API.");
      }
    } catch (error) {
      console.error("Error parsing response:", error);
      console.log("Raw response:", data);
    }
  });
});

// Handle request errors
req.on("error", (error) => {
  console.error("Error making request:", error.message);
  if (error.code === "ECONNREFUSED") {
    console.error(
      `Could not connect to the server. Make sure it's running on port ${PORT}.`
    );
    console.error("Start the server with: npm run dev");
  }
});

// Send the request data
req.write(JSON.stringify(emailData));
req.end();
