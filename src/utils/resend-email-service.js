const { Resend } = require("resend");
const dotenv = require("dotenv");
const templateService = require("../services/template.service");
const path = require("path");
const fs = require("fs");

// Load environment variables
dotenv.config();

const apiKey = process.env.RESEND_API_KEY;
if (!apiKey) {
  console.error("RESEND_API_KEY is missing in environment variables");
}

const resend = new Resend(apiKey);

// Default sender address
const DEFAULT_FROM = "DORY <noreply@groceriacorporation.com>";

/**
 * Retry a function with exponential backoff
 * @param {Function} fn - Function to retry
 * @param {number} maxRetries - Maximum number of retries
 * @param {number} initialDelay - Initial delay in ms
 * @returns {Promise<any>} - Result of the function
 */
const retryWithBackoff = async (fn, maxRetries = 3, initialDelay = 300) => {
  let retries = 0;

  while (true) {
    try {
      return await fn();
    } catch (error) {
      retries++;

      // If we've hit max retries or it's not a connection error, throw
      if (
        retries >= maxRetries ||
        (error.code !== "ECONNRESET" &&
          error.code !== "ETIMEDOUT" &&
          error.code !== "ECONNREFUSED")
      ) {
        throw error;
      }

      // Calculate delay with exponential backoff
      const delay = initialDelay * Math.pow(2, retries - 1);
      console.log(
        `Retry attempt ${retries} after ${delay}ms for error: ${error.code}`
      );

      // Wait before retrying
      await new Promise((resolve) => setTimeout(resolve, delay));
    }
  }
};

/**
 * Send an email using a template
 * @param {string|string[]} to - Recipient email address or addresses
 * @param {string} subject - Email subject
 * @param {string} templateName - Name of the template to use (without extension)
 * @param {Object} data - Data to be used in the template
 * @param {Object} options - Additional options for sending email
 * @returns {Promise<Object>} - Response with messageId
 */
const sendEmailWithTemplate = async (
  to,
  subject,
  templateName,
  data = {},
  options = {}
) => {
  try {
    if (!apiKey) {
      throw new Error("RESEND_API_KEY is missing in environment variables");
    }

    // Use your existing templateService to compile the template
    const html = await templateService.getCompiledTemplate(templateName, data);

    // Configure email options for Resend
    const emailOptions = {
      from: options.from || DEFAULT_FROM,
      to: Array.isArray(to) ? to : [to],
      subject,
      html,
    };

    // Add CC if provided
    if (options.cc) {
      emailOptions.cc = Array.isArray(options.cc) ? options.cc : [options.cc];
    }

    // Add BCC if provided
    if (options.bcc) {
      emailOptions.bcc = Array.isArray(options.bcc)
        ? options.bcc
        : [options.bcc];
    }

    // Add reply-to if provided
    if (options.replyTo) {
      emailOptions.reply_to = options.replyTo;
    }

    // ✅ Handle optional attachments

    if (options.attachments && Array.isArray(options.attachments)) {
      const validAttachments = options.attachments
        .map((file) => {
          try {
            let filePath = file.path;
            // If the path is not absolute, resolve it to src/attachments
            if (filePath && !path.isAbsolute(filePath)) {
              filePath = path.resolve(__dirname, "../attachments", filePath);
            }
            if (!filePath || !fs.existsSync(filePath)) {
              console.warn(`Attachment not found: ${filePath}`);
              return null;
            }

            const fileBuffer = fs.readFileSync(filePath);
            return {
              filename: file.filename || path.basename(filePath),
              content: fileBuffer.toString("base64"),
            };
          } catch (err) {
            console.error("Error reading attachment:", err);
            return null;
          }
        })
        .filter(Boolean);

      if (validAttachments.length > 0) {
        emailOptions.attachments = validAttachments;
      }
    }

    // Send the email using Resend with retry mechanism
    const result = await retryWithBackoff(() =>
      resend.emails.send(emailOptions)
    );

    return {
      messageId: result.id,
    };
  } catch (error) {
    console.error("Failed to send email after retries:", error);
    throw error;
  }
};

module.exports = {
  sendEmailWithTemplate,
};
