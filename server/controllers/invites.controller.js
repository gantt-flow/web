import Invite from "../models/invite.js";
import Project from "../models/project.js";
import User from "../models/user.js";
import { isValidObjectId } from "mongoose";
import { logger } from "../utils/logger.js";
import { sendEmail, generateInvitationEmailHTML } from "../utils/email.js";
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
        const emailHtml = generateInvitationEmailHTML({
            projectName: project.name,
            invitationLink: invitationLink,
        });

        await sendEmail({
            to: email,
            subject: `Invitación para unirte al proyecto ${project.name}`,
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
        if (!user.projectId.includes(project._id)) {
            user.projectId.push(project._id);
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