// const emailService = require("../services/email.service");
const templateService = require("../services/template.service");
const { ApiError, asyncHandler } = require("../utils/error-handler");
const resendService = require("../utils/resend-email-service");

/**
 * Send an email using a template
 * @route POST /api/email/send
 */
const sendEmail = asyncHandler(async (req, res) => {
  const { to, subject, templateName, data, options } = req.body;

  // Validate required fields
  if (!to) {
    throw new ApiError(400, "Recipient(s) are required");
  }

  if (!subject) {
    throw new ApiError(400, "Subject is required");
  }

  if (!templateName) {
    throw new ApiError(400, "Template name is required");
  }

  // Send the email
  // const result = await emailService.sendEmailWithTemplate(
  //   to,
  //   subject,
  //   templateName,
  //   data || {},
  //   options || {}
  // );

  const result = await resendService.sendEmailWithTemplate(
    to,
    subject,
    templateName,
    data || {},
    options || {}
  );

  res.status(200).json({
    success: true,
    message: "Email sent successfully",
    messageId: result.messageId,
  });
});

/**
 * Get a list of available email templates
 * @route GET /api/email/templates
 */
const getTemplates = asyncHandler(async (req, res) => {
  const templates = await templateService.getAvailableTemplates();

  res.status(200).json({
    success: true,
    templates,
  });
});

module.exports = {
  sendEmail,
  getTemplates,
};
