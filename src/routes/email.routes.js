const express = require("express");
const {
  sendEmail,
  getTemplates,
  sendBatchEmails,
} = require("../controllers/email.controller");

const router = express.Router();

/**
 * @route POST /api/email/send
 * @desc Send an email using a template
 * @access Public
 */
router.post("/send", sendEmail);

/**
 * @route GET /api/email/templates
 * @desc Get a list of available email templates
 * @access Public
 */
router.get("/templates", getTemplates);

/**
 * @route POST /api/email/batch-send
 * @desc Send batch emails using a template
 * @access Public
 */
router.post("/batch-send", sendBatchEmails);

module.exports = router;
