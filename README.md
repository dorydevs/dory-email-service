# Dory Email Service

A Node.js email service built with Express.js and Nodemailer that allows sending template-based emails through a REST API.

## Features

- Send emails using customizable templates
- Support for multiple recipients
- Handlebars templating for dynamic email content
- Environment-based configuration
- Error handling and logging

## Prerequisites

- Node.js (v14+)
- SMTP server access (or use a service like SendGrid, Mailgun, etc.)

## Installation

1. Clone the repository:

```bash
git clone https://github.com/yourusername/dory-email-service.git
cd dory-email-service
```

2. Install dependencies:

```bash
npm install
```

3. Create a `.env` file based on the `.env.example` template:

```bash
cp .env.example .env
```

4. Update the `.env` file with your SMTP server details:

```
EMAIL_HOST=your.smtp.host
EMAIL_PORT=587
EMAIL_USER=your-email@example.com
EMAIL_PASS=your-password
EMAIL_FROM=no-reply@yourdomain.com
```

## Running the service

### Development mode

```bash
npm run dev
```

### Production mode

```bash
npm start
```

## API Endpoints

### Send Email

```
POST /api/email/send
```

Request body:

```json
{
  "to": "recipient@example.com", // String or Array of strings
  "subject": "Email Subject",
  "templateName": "welcome", // Name of the template file (without extension)
  "data": {
    "name": "John Doe",
    "message": "Welcome to our service!"
    // Any other data to be used in the template
  },
  "options": {
    "cc": "cc@example.com",
    "bcc": "bcc@example.com"
    // Any other nodemailer options
  }
}
```

Response:

```json
{
  "success": true,
  "message": "Email sent successfully",
  "messageId": "message-id-from-email-server"
}
```

### Get Available Templates

```
GET /api/email/templates
```

Response:

```json
{
  "success": true,
  "templates": ["welcome", "confirmation"]
}
```

## Adding New Templates

1. Create a new `.hbs` file in the `src/templates` directory
2. Use Handlebars syntax for dynamic content
3. The template name (without the `.hbs` extension) will be used as the `templateName` in the API request

## License

ISC
