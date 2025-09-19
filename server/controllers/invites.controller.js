import Invite from "../models/invite.js";
import Project from "../models/project.js";
import User from "../models/user.js";
import { isValidObjectId } from "mongoose";
import { logger } from "../utils/logger.js";
import { sendEmail } from "../utils/email.js";
import crypto from "crypto";

export const createInvite = async (req, res) => {
    try {
        const { email, projectId, role } = req.body;
        const invitedBy = req.user._id; 

        // Validar campos requeridos
        if (!email || !projectId) {
            return res.status(400).json({ message: 'Email y projectId son requeridos' });
        }

        // Validar ObjectIds
        if (!isValidObjectId(projectId) || !isValidObjectId(invitedBy)) {
            return res.status(400).json({ message: 'ID de proyecto o usuario inválido' });
        }

        // Verificar si el proyecto existe
        const project = await Project.findById(projectId);
        if (!project) {
            return res.status(404).json({ message: 'Proyecto no encontrado' });
        }

        // Verificar si el usuario ya es miembro del proyecto
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            const isAlreadyMember = project.teamMembers.includes(existingUser._id);
            if (isAlreadyMember) {
                return res.status(400).json({ message: 'El usuario ya es miembro del proyecto' });
            }
        }

        // Verificar si ya existe una invitación pendiente para este email y proyecto
        const existingInvite = await Invite.findOne({ 
            email, 
            projectId,
            status: 'pending'
        });

        let inviteToUse;
        let isNewInvite = false;

        if (existingInvite) {
            // Si ya existe una invitación pendiente, actualizarla en lugar de crear una nueva
            const newToken = crypto.randomBytes(32).toString('hex');
            const newExpiresAt = new Date();
            newExpiresAt.setDate(newExpiresAt.getDate() + 7);
            
            existingInvite.token = newToken;
            existingInvite.expiresAt = newExpiresAt;
            existingInvite.role = role || existingInvite.role;
            existingInvite.invitedBy = invitedBy;
            
            await existingInvite.save();
            inviteToUse = existingInvite;
        } else {
            // Si no existe una invitación pendiente, crear una nueva
            const token = crypto.randomBytes(32).toString('hex');
            const expiresAt = new Date();
            expiresAt.setDate(expiresAt.getDate() + 7);

            const newInvite = new Invite({
                email,
                invitedBy,
                projectId,
                role: role || 'Miembro de equipo',
                token,
                expiresAt
            });

            await newInvite.save();
            inviteToUse = newInvite;
            isNewInvite = true;
        }

        // Enviar correo de invitación
        const invitationLink = `${process.env.FRONTEND_URL}/accept-invite?token=${inviteToUse.token}`;
        const emailSubject = `Invitación para unirte al proyecto ${project.name}`;
        const emailHtml = `
                <!DOCTYPE html>
                <html>
                <head>
                    <meta charset="UTF-8">
                    <meta name="viewport" content="width=device-width, initial-scale=1.0">
                    <title>Invitación a GanttFlow</title>
                </head>
                <body style="margin: 0; padding: 0; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f7fafc;">
                    <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color: #f7fafc; padding: 40px 0;">
                        <tr>
                            <td align="center">
                                <table width="100%" cellpadding="0" cellspacing="0" border="0" style="max-width: 600px; background-color: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
                                    <!-- Header -->
                                    <tr>
                                        <td style="background: linear-gradient(135deg, #10b981 0%, #059669 100%); padding: 30px; text-align: center;">
                                            <h1 style="color: white; margin: 0; font-size: 28px; font-weight: 600;">GanttFlow</h1>
                                            <p style="color: rgba(255, 255, 255, 0.9); margin: 10px 0 0; font-size: 16px;">Gestión de Proyectos Inteligente</p>
                                        </td>
                                    </tr>
                                    
                                    <!-- Content -->
                                    <tr>
                                        <td style="padding: 40px 30px;">
                                            <h2 style="color: #1f2937; margin-top: 0; font-size: 24px; font-weight: 600;">¡Te han invitado a unirte a un proyecto!</h2>
                                            
                                            <p style="color: #4b5563; font-size: 16px; line-height: 1.6;">
                                                Has recibido una invitación para unirte al proyecto:
                                            </p>
                                            
                                            <div style="background-color: #f3f4f6; border-left: 4px solid #10b981; padding: 16px; margin: 20px 0; border-radius: 4px;">
                                                <p style="color: #1f2937; margin: 0; font-size: 18px; font-weight: 500;">
                                                    ${project.name}
                                                </p>
                                            </div>
                                            
                                            <p style="color: #4b5563; font-size: 16px; line-height: 1.6;">
                                                GanttFlow es una plataforma de gestión de proyectos que te ayudará a organizar tareas, 
                                                colaborar con tu equipo y seguir el progreso de tus proyectos de manera eficiente.
                                            </p>
                                            
                                            <table width="100%" cellpadding="0" cellspacing="0" border="0" style="margin: 30px 0;">
                                                <tr>
                                                    <td align="center">
                                                        <a href="${invitationLink}" style="display: inline-block; padding: 16px 32px; background-color: #10b981; color: white; text-decoration: none; border-radius: 6px; font-weight: 600; font-size: 16px; box-shadow: 0 4px 6px rgba(16, 185, 129, 0.3); transition: all 0.3s ease;">
                                                            Aceptar Invitación
                                                        </a>
                                                    </td>
                                                </tr>
                                            </table>
                                            
                                            <p style="color: #6b7280; font-size: 14px; line-height: 1.6; margin-top: 30px;">
                                                Si tienes problemas con el botón, copia y pega la siguiente URL en tu navegador:
                                            </p>
                                            
                                            <p style="color: #3b82f6; font-size: 14px; word-break: break-all; background-color: #f9fafb; padding: 12px; border-radius: 4px;">
                                                ${invitationLink}
                                            </p>
                                            
                                            <div style="border-top: 1px solid #e5e7eb; margin-top: 30px; padding-top: 20px;">
                                                <p style="color: #9ca3af; font-size: 12px; margin: 0;">
                                                    <strong>Nota:</strong> Este enlace expirará en 7 días. Si no aceptas la invitación 
                                                    antes de esa fecha, deberás solicitar una nueva invitación.
                                                </p>
                                            </div>
                                        </td>
                                    </tr>
                                    
                                    <!-- Footer -->
                                    <tr>
                                        <td style="background-color: #f9fafb; padding: 20px; text-align: center; border-top: 1px solid #e5e7eb;">
                                            <p style="color: #6b7280; font-size: 12px; margin: 0;">
                                                © ${new Date().getFullYear()} GanttFlow. Todos los derechos reservados.
                                            </p>
                                            <p style="color: #6b7280; font-size: 12px; margin: 10px 0 0;">
                                                Si recibiste este correo por error, puedes ignorarlo de manera segura.
                                            </p>
                                        </td>
                                    </tr>
                                </table>
                            </td>
                        </tr>
                    </table>
                </body>
                </html>
                `;

        await sendEmail({
            to: email,
            subject: emailSubject,
            html: emailHtml
        });

        res.status(isNewInvite ? 201 : 200).json({ 
            message: isNewInvite ? 'Invitación enviada con éxito' : 'Invitación actualizada y reenviada con éxito', 
            invite: {
                _id: inviteToUse._id,
                email: inviteToUse.email,
                role: inviteToUse.role,
                expiresAt: inviteToUse.expiresAt
            }
        });

    } catch (error) {
        logger.error(`Error creating invite: ${error.message}`);
        
        // Manejar específicamente errores de duplicado del índice compuesto
        if (error.code === 11000 && error.keyPattern && error.keyPattern.email && error.keyPattern.projectId) {
            return res.status(400).json({ 
                message: 'Ya existe una invitación para este usuario en este proyecto' 
            });
        }
        
        res.status(500).json({ message: 'Error interno del servidor' });
    }
};

export const acceptInvite = async (req, res) => {
    try {
        const { token } = req.params;

        // Buscar la invitación por token
        const invite = await Invite.findOne({ token })
            .populate('projectId', 'name teamMembers')
            .populate('invitedBy', 'name email');
            
        if (!invite) {
            return res.status(404).json({ message: 'Invitación no válida' });
        }

        // Verificar si la invitación ha expirado
        if (invite.expiresAt < new Date()) {
            return res.status(400).json({ message: 'La invitación ha expirado' });
        }

        // Verificar si ya fue aceptada
        if (invite.status === 'accepted') {
            return res.status(400).json({ message: 'La invitación ya fue aceptada' });
        }

        // Buscar al usuario por email o crear uno nuevo si no existe
        let user = await User.findOne({ email: invite.email });
        if (!user) {
            // En un caso real, aquí redirigirías al usuario a una página de registro
            return res.status(404).json({ 
                message: 'Usuario no encontrado. Debe registrarse primero.' 
            });
        }

        // Añadir el usuario al proyecto
        const project = await Project.findById(invite.projectId);
        if (!project.teamMembers.includes(user._id)) {
            project.teamMembers.push(user._id);
            await project.save();
        }

        // También actualizar el usuario si es necesario (dependiendo de tu modelo)
        // Por ejemplo, si tienes un array de proyectos en el usuario:
        if (user.projects && !user.projects.includes(project._id)) {
            user.projects.push(project._id);
            await user.save();
        }

        // Actualizar el estado de la invitación
        invite.status = 'accepted';
        await invite.save();

        res.status(200).json({ 
            message: 'Invitación aceptada con éxito', 
            projectId: invite.projectId._id,
            projectName: invite.projectId.name
        });
    } catch (error) {
        logger.error(`Error accepting invite: ${error.message}`);
        res.status(500).json({ message: 'Error interno del servidor' });
    }
};

export const getInvite = async (req, res) => {
    try {
        const { token } = req.params;

        const invite = await Invite.findOne({ token })
            .populate('projectId', 'name')
            .populate('invitedBy', 'name email');

        if (!invite) {
            return res.status(404).json({ message: 'Invitación no encontrada' });
        }

        res.status(200).json(invite);
    } catch (error) {
        logger.error(`Error getting invite: ${error.message}`);
        res.status(500).json({ message: 'Error interno del servidor' });
    }
};