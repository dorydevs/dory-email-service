const fs = require("fs").promises;
const path = require("path");
const handlebars = require("handlebars");

/**
 * Service for handling email templates
 */
class TemplateService {
  /**
   * Get the compiled template with given data
   * @param {string} templateName - Name of the template to render
   * @param {object} data - Data to inject into the template
   * @returns {Promise<string>} Compiled HTML content
   */
  async getCompiledTemplate(templateName, data) {
    try {
      // Get template path
      const templatePath = path.join(
        __dirname,
        "../templates",
        `${templateName}.hbs`
      );

      // Read template file
      const templateContent = await fs.readFile(templatePath, "utf-8");

      // Compile template with handlebars
      const template = handlebars.compile(templateContent);

      // Return compiled template with provided data
      return template(data);
    } catch (error) {
      if (error.code === "ENOENT") {
        throw new Error(`Template "${templateName}" not found`);
      }
      throw error;
    }
  }

  /**
   * Get all available template names
   * @returns {Promise<string[]>} List of template names
   */
  async getAvailableTemplates() {
    try {
      const templatesDir = path.join(__dirname, "../templates");
      const files = await fs.readdir(templatesDir);

      // Filter only .hbs files and remove extension
      return files
        .filter((file) => path.extname(file) === ".hbs")
        .map((file) => path.basename(file, ".hbs"));
    } catch (error) {
      throw new Error(`Failed to read templates directory: ${error.message}`);
    }
  }
}

module.exports = new TemplateService();
