const express = require("express");
const { sendEmail, getTemplates } = require("../controllers/email.controller");

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

module.exports = router;
