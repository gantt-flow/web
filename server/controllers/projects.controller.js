import Project from "../models/project.js";
import User from "../models/user.js";
import { isValidObjectId } from "mongoose";
import { logger } from "../utils/logger.js";
import { generateAuditLog } from '../utils/auditService.js';

export const createProject = async (req, res) => {
    try {
        const { name, description, startDate, endDate, status } = req.body;
        const projectManagerId = req.user._id;

        // Validate the required fields
        if (!name || !description) {
            return res.status(400).json({ message: 'Recuerda llenar los campos requeridos' });
        }

        // Create a new project entry
        const newProject = new Project({
            name,
            description,
            startDate,
            endDate,
            status,
            projectManager: projectManagerId
        });

        await newProject.save();

        await generateAuditLog(req, 'CREATE', 'Project', newProject._id, `Proyecto creado: "${name}" - Propietario: ${projectManagerId}`);

        res.status(201).json({ message: 'Project created successfully', project: newProject });
        
    } catch (error) {
        logger.error(`Error creating project: ${error.message}`);
        res.status(500).json({ message: 'Internal server error' });
    }
}

export const getProjectById = async (req, res) => {
    try {
        const { id } = req.params;

        // Validate the project ID
        if (!isValidObjectId(id)) {
            return res.status(400).json({ message: 'Invalid project ID' });
        }

        // Fetch the project by ID
        const project = await Project.findById(id)
            .select('name description startDate endDate status')
            .populate('teamMembers', 'name email role profilePicture')
            .populate('projectManager', 'name');

        if (!project) {
            return res.status(404).json({ message: 'Project not found' });
        }

        res.status(200).json(project);
    } catch (error) {
        logger.error(`Error fetching project by ID: ${error.message}`);
        res.status(500).json({ message: 'Internal server error' });
    }
}


export const getCurrentUserProjects = async (req, res) => {
    try {
        const userId = req.params.id;

        // Validate the user ID
        if (!isValidObjectId(userId)) {
            return res.status(400).json({ message: 'Invalid user ID' });
        }

        // Fetch the user from the database
        const user = await User.findById(userId).populate('projectId').select('projectId'); // Populate only the projects field
        
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        res.status(200).json(user.projectId);
    } catch (error) {
        logger.error(`Error fetching user's projects: ${error.message}`);
        handleError(res, error);
    }
}

export const updateProject = async (req, res) => {
    try {
        const { id } = req.params;
        const updateData = req.body;

        // Validate the project ID
        if (!isValidObjectId(id)) {
            return res.status(400).json({ message: 'Invalid project ID' });
        }

        // Update the project
        const updatedProject = await Project.findByIdAndUpdate(id, updateData, { new: true });

        if (!updatedProject) {
            return res.status(404).json({ message: 'Project not found' });
        }

        await generateAuditLog(req, 'UPDATE', 'Project', id, `Proyecto actualizado: "${createProject.name}". Cambios: ${changes.join(', ')}`);

        res.status(200).json({ message: 'Project updated successfully', project: updatedProject });
    } catch (error) {
        logger.error(`Error updating project: ${error.message}`);
        res.status(500).json({ message: 'Internal server error' });
    }
}

export const deleteProject = async (req, res) => {
    try {
        const { id } = req.params;

        // Validate the project ID
        if (!isValidObjectId(id)) {
            return res.status(400).json({ message: 'Invalid project ID' });
        }

        // Delete the project
        const deletedProject = await Project.findByIdAndDelete(id);

        if (!deletedProject) {
            return res.status(404).json({ message: 'Project not found' });
        }

        await generateAuditLog(req, 'DELETE', 'Project', id, `Proyecto eliminado: "${Project.name}" - Propietario: ${Project.ownerId}`);

        res.status(200).json({ message: 'Project deleted successfully' });
    } catch (error) {
        logger.error(`Error deleting project: ${error.message}`);
        res.status(500).json({ message: 'Internal server error' });
    }
}

export const getAllProjects = async (req, res) => {
    try {
        const projects = await Project.find();
        res.status(200).json(projects);
    } catch (error) {
        logger.error(`Error fetching all projects: ${error.message}`);
        res.status(500).json({ message: 'Internal server error' });
    }
}


export const addMemberToProject = async (req, res) => {
    try {
        const { projectId } = req.params;
        const { email } = req.body;

        const userToAdd = await User.findOne({ email });
        if (!userToAdd) {
            return res.status(404).json({ message: 'Usuario no encontrado con ese email.' });
        }

        // Solo se actualiza el proyecto
        const project = await Project.findByIdAndUpdate(
            projectId,
            { $addToSet: { teamMembers: userToAdd._id } },
            { new: true }
        );

        if (!project) {
            return res.status(404).json({ message: 'Proyecto no encontrado.' });
        }

        // Se vuelve a buscar el proyecto y se poblan los datos
        const populatedProject = await Project.findById(project._id)
            .populate('teamMembers', 'name email role profilePicture');

        // Se envía la lista de miembros ya poblada
        res.status(200).json(populatedProject.teamMembers);

    } catch (error) {
        logger.error(`Error adding member to project: ${error.message}`);
        res.status(500).json({ message: 'Error interno del servidor' });
    }
};

export const removeMemberFromProject = async (req, res) => {
    try {
        const { projectId, memberId } = req.params;

        const project = await Project.findByIdAndUpdate(
            projectId,
            { $pull: { teamMembers: memberId } }, // $pull elimina un elemento de un array
            { new: true }
        );

        if (!project) {
            return res.status(404).json({ message: 'Proyecto no encontrado.' });
        }

        res.status(200).json({ message: 'Miembro eliminado correctamente.' });
    } catch (error) {
        logger.error(`Error removing member from project: ${error.message}`);
        res.status(500).json({ message: 'Error interno del servidor' });
    }
};

export const addProjectManagerToProject = async (req, res) => {
    try{

        const userId  = req.user._id;
        const { projectId } = req.params;

        if (!userId || !projectId) {
            return res.status(400).json({ message: 'Datos no válidos.' });
        }

        // * Solo se actualiza el campo de proyectos del usuario
        const projectToUpdate = await Project.findByIdAndUpdate(
            projectId,
            { projectManager: userId },
            { new: true }
        );

        if (!projectToUpdate) {
            return res.status(404).json({ message: 'Proyecto no encontrado.' });
        }

        const userToAddProject = await User.findByIdAndUpdate(
            userId,
            { $addToSet: {projectId: Object(projectId)}},
            { new: true }
        )

        if (!userToAddProject) {
            return res.status(404).json({ message: 'Usuario no encontrado.' });
        }

        // Se solo un mensaje de éxito
        res.status(200).json({ message: "Proyecto agregado al usuario."});

    }catch (error) {
        logger.error(`Error adding project manager to project: ${error.message}`);
        res.status(500).json({ message: "Error interno del servidor"})
    }
}