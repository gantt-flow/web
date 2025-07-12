import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST || 'smtp.example.com',
    port: process.env.SMTP_PORT ? parseInt(process.env.SMTP_PORT) : 587,
    secure: process.env.SMTP_SECURE === 'true', // true for 465, false for other ports
    auth: {
        user: process.env.SMTP_USER || 'user@example.com',
        pass: process.env.SMTP_PASS || 'password',
    },
});

/**
 * Send an email using nodemailer.
 * @param {Object} options
 * @param {string} options.to - Recipient email address
 * @param {string} options.subject - Email subject
 * @param {string} [options.text] - Plain text body
 * @param {string} [options.html] - HTML body
 * @returns {Promise<Object>} - Nodemailer info object
 */
export const sendEmail = async ({ to, subject, text, html }) => {
    if (!to || !subject || (!text && !html)) {
        throw new Error('Missing required email fields');
    }

    const mailOptions = {
        from: process.env.SMTP_FROM || '"Gantt Flow" <no-reply@ganttflow.com>',
        to,
        subject,
        text,
        html,
    };

    try {
        const info = await transporter.sendMail(mailOptions);
        console.log(`Email sent to ${to}: ${info.messageId}`);
        return info;
    } catch (error) {
        console.error(`Error sending email to ${to}:`, error);
        throw error;
    }
};