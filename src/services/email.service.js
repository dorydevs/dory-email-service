// const nodemailer = require("nodemailer");
// const emailConfig = require("../config/email.config");
// const templateService = require("./template.service");

// /**
//  * Service for sending emails
//  */
// class EmailService {
//   constructor() {
//     this.transporter = nodemailer.createTransport({
//       host: emailConfig.host,
//       port: emailConfig.port,
//       secure: emailConfig.secure,
//       auth: {
//         user: emailConfig.auth.user,
//         pass: emailConfig.auth.pass,
//       },
//     });
//   }

//   /**
//    * Send an email using a template
//    * @param {string|string[]} to - Recipient email address(es)
//    * @param {string} subject - Email subject
//    * @param {string} templateName - Name of the email template to use
//    * @param {object} data - Data to inject into the template
//    * @param {object} options - Additional email options (cc, bcc, attachments, etc.)
//    * @returns {Promise<object>} Email sending result
//    */
//   async sendEmailWithTemplate(to, subject, templateName, data, options = {}) {
//     try {
//       // Get compiled HTML from template
//       const html = await templateService.getCompiledTemplate(
//         templateName,
//         data
//       );

//       // Prepare email options
//       const mailOptions = {
//         from: options.from || emailConfig.from,
//         to: Array.isArray(to) ? to.join(",") : to,
//         subject,
//         html,
//         ...options,
//       };

//       // Send email
//       return await this.transporter.sendMail(mailOptions);
//     } catch (error) {
//       throw new Error(`Failed to send email: ${error.message}`);
//     }
//   }

//   /**
//    * Verify SMTP connection
//    * @returns {Promise<boolean>} Connection verification result
//    */
//   async verifyConnection() {
//     try {
//       await this.transporter.verify();
//       return true;
//     } catch (error) {
//       console.error("SMTP Connection Error:", error);
//       return false;
//     }
//   }
// }

// module.exports = new EmailService();
