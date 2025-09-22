import nodemailer from 'nodemailer';

// --- Configuración del Transporter (Sin cambios) ---
const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: parseInt(process.env.SMTP_PORT || '587'),
    secure: process.env.SMTP_SECURE === 'true',
    auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
    },
});

// --- Plantilla de Correo para INVITACIONES (Tu diseño) ---
export const generateInvitationEmailHTML = ({ projectName, invitationLink }) => {
    const mainColor = '#22c55e'; // Un verde más esmeralda como en tu diseño
    return `
    <!DOCTYPE html>
    <html>
    <head>
        <meta charset="UTF-8"><title>Invitación a GanttFlow</title>
    </head>
    <body style="margin: 0; padding: 0; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f7fafc;">
        <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color: #f7fafc; padding: 40px 0;">
            <tr><td align="center">
                <table width="100%" cellpadding="0" cellspacing="0" border="0" style="max-width: 600px; background-color: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
                    <tr><td style="background: linear-gradient(135deg, ${mainColor} 0%, #059669 100%); padding: 30px; text-align: center;">
                        <h1 style="color: white; margin: 0; font-size: 28px; font-weight: 600;">GanttFlow</h1>
                        <p style="color: rgba(255, 255, 255, 0.9); margin: 10px 0 0; font-size: 16px;">Gestión de Proyectos Inteligente</p>
                    </td></tr>
                    <tr><td style="padding: 40px 30px;">
                        <h2 style="color: #1f2937; margin-top: 0; font-size: 24px; font-weight: 600;">¡Te han invitado a unirte a un proyecto!</h2>
                        <p style="color: #4b5563; font-size: 16px; line-height: 1.6;">Has recibido una invitación para unirte al proyecto:</p>
                        <div style="background-color: #f3f4f6; border-left: 4px solid ${mainColor}; padding: 16px; margin: 20px 0; border-radius: 4px;">
                            <p style="color: #1f2937; margin: 0; font-size: 18px; font-weight: 500;">${projectName}</p>
                        </div>
                        <table width="100%" cellpadding="0" cellspacing="0" border="0" style="margin: 30px 0;">
                            <tr><td align="center">
                                <a href="${invitationLink}" style="display: inline-block; padding: 16px 32px; background-color: ${mainColor}; color: white; text-decoration: none; border-radius: 6px; font-weight: 600; font-size: 16px;">Aceptar Invitación</a>
                            </td></tr>
                        </table>
                        <p style="color: #6b7280; font-size: 14px; line-height: 1.6; margin-top: 30px;">Si tienes problemas con el botón, copia y pega la siguiente URL en tu navegador:</p>
                        <p style="color: #3b82f6; font-size: 14px; word-break: break-all;">${invitationLink}</p>
                    </td></tr>
                    <tr><td style="background-color: #f9fafb; padding: 20px; text-align: center; border-top: 1px solid #e5e7eb;">
                        <p style="color: #6b7280; font-size: 12px; margin: 0;">© ${new Date().getFullYear()} GanttFlow. Todos los derechos reservados.</p>
                    </td></tr>
                </table>
            </td></tr>
        </table>
    </body>
    </html>`;
};

// --- Plantilla de Correo para RESTABLECER CONTRASEÑA ---
export const generatePasswordResetEmailHTML = ({ resetUrl }) => {
    const mainColor = '#22c55e'; // El green-500 que definimos
    return `
    <!DOCTYPE html>
    <html>
    <head>
        <meta charset="UTF-8"><title>Restablecer Contraseña</title>
    </head>
    <body style="margin: 0; padding: 0; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f7fafc;">
        <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color: #f7fafc; padding: 40px 0;">
            <tr><td align="center">
                <table width="100%" cellpadding="0" cellspacing="0" border="0" style="max-width: 600px; background-color: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
                    <tr><td style="background-color: ${mainColor}; padding: 30px; text-align: center;">
                        <h1 style="color: white; margin: 0; font-size: 28px; font-weight: 600;">GanttFlow</h1>
                    </td></tr>
                    <tr><td style="padding: 40px 30px;">
                        <h2 style="color: #1f2937; margin-top: 0; font-size: 24px; font-weight: 600;">Restablece tu Contraseña</h2>
                        <p style="color: #4b5563; font-size: 16px; line-height: 1.6;">Has solicitado restablecer tu contraseña. Haz clic en el botón de abajo para continuar. Este enlace es válido por 1 hora.</p>
                        <table width="100%" cellpadding="0" cellspacing="0" border="0" style="margin: 30px 0;">
                            <tr><td align="center">
                                <a href="${resetUrl}" style="display: inline-block; padding: 16px 32px; background-color: ${mainColor}; color: white; text-decoration: none; border-radius: 6px; font-weight: 600; font-size: 16px;">Restablecer Contraseña</a>
                            </td></tr>
                        </table>
                        <p style="color: #6b7280; font-size: 14px; line-height: 1.6; margin-top: 30px;">Si no solicitaste este cambio, puedes ignorar este correo de forma segura.</p>
                    </td></tr>
                    <tr><td style="background-color: #f9fafb; padding: 20px; text-align: center; border-top: 1px solid #e5e7eb;">
                        <p style="color: #6b7280; font-size: 12px; margin: 0;">© ${new Date().getFullYear()} GanttFlow. Todos los derechos reservados.</p>
                    </td></tr>
                </table>
            </td></tr>
        </table>
    </body>
    </html>`;
};


/**
 * Función principal para enviar correos. Ahora solo necesita el HTML.
 * @param {Object} options
 * @param {string} options.to - Recipient email address
 * @param {string} options.subject - Email subject
 * @param {string} options.html - HTML body
 * @returns {Promise<Object>}
 */
export const sendEmail = async ({ to, subject, html }) => {
    if (!to || !subject || !html) {
        throw new Error('Missing required email fields');
    }

    const mailOptions = {
        from: process.env.SMTP_FROM || '"GanttFlow" <no-reply@ganttflow.com>',
        to,
        subject,
        html,
        // Opcional: generar texto plano a partir del HTML para clientes antiguos
        text: html.replace(/<[^>]*>?/gm, ''),
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