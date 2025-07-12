import Project from "../models/project.js";
import { isValidObjectId } from "mongoose";
import { logger } from "../utils/logger.js";

export const createProject = async (req, res) => {
    try {
        const { name, description, ownerId } = req.body;

        // Validate the required fields
        if (!name || !description || !ownerId) {
            return res.status(400).json({ message: 'Fill all the required fields' });
        }

        // Validate ObjectId for ownerId
        if (!isValidObjectId(ownerId)) {
            return res.status(400).json({ message: 'Invalid owner ID' });
        }

        // Create a new project entry
        const newProject = new Project({
            name,
            description,
            ownerId
        });

        await newProject.save();

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
        const project = await Project.findById(id).populate('ownerId', 'name email');

        if (!project) {
            return res.status(404).json({ message: 'Project not found' });
        }

        res.status(200).json(project);
    } catch (error) {
        logger.error(`Error fetching project by ID: ${error.message}`);
        res.status(500).json({ message: 'Internal server error' });
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

        res.status(200).json({ message: 'Project deleted successfully' });
    } catch (error) {
        logger.error(`Error deleting project: ${error.message}`);
        res.status(500).json({ message: 'Internal server error' });
    }
}

