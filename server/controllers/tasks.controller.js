import Task from "../models/task.js";
import { isValidObjectId } from "mongoose";
import { logger } from "../utils/logger.js";
import { handleError } from "../utils/errorHandler.js";

export const createTask = async (req, res) => {
    try {
        const { title, description, dueDate, assignedTo, projectId } = req.body;

        // Validate the required fields
        if (!title || !dueDate || !assignedTo || !projectId) {
            return res.status(400).json({ message: 'Fill all the required fields' });
        }

        // Validate ObjectIds
        if (!isValidObjectId(assignedTo) || !isValidObjectId(projectId)) {
            return res.status(400).json({ message: 'Invalid user ID or project ID' });
        }

        // Create a new task entry
        const newTask = new Task({
            title,
            description,
            dueDate,
            assignedTo,
            projectId
        });

        await newTask.save();

        res.status(201).json({ message: 'Task created successfully', task: newTask });
    } catch (error) {
        logger.error(`Error creating task: ${error.message}`);
        handleError(res, error);
    }
}

export const getTasksByProject = async (req, res) => {
    try {
        const { projectId } = req.params;

        // Validate the project ID
        if (!isValidObjectId(projectId)) {
            return res.status(400).json({ message: 'Invalid project ID' });
        }

        // Fetch tasks for the specified project
        const tasks = await Task.find({ projectId }).populate('assignedTo', 'name email');

        if (tasks.length === 0) {
            return res.status(404).json({ message: 'No tasks found for this project' });
        }

        res.status(200).json(tasks);
    } catch (error) {
        logger.error(`Error fetching tasks: ${error.message}`);
        handleError(res, error);
    }
}

export const updateTask = async (req, res) => {
    try {
        const { taskId } = req.params;
        const updates = req.body;

        // Validate the task ID
        if (!isValidObjectId(taskId)) {
            return res.status(400).json({ message: 'Invalid task ID' });
        }

        // Update the task in the database
        const updatedTask = await Task.findByIdAndUpdate(taskId, updates, { new: true });

        if (!updatedTask) {
            return res.status(404).json({ message: 'Task not found' });
        }

        res.status(200).json({ message: 'Task updated successfully', task: updatedTask });
    } catch (error) {
        logger.error(`Error updating task: ${error.message}`);
        handleError(res, error);
    }
}

export const deleteTask = async (req, res) => {
    try {
        const { taskId } = req.params;

        // Validate the task ID
        if (!isValidObjectId(taskId)) {
            return res.status(400).json({ message: 'Invalid task ID' });
        }

        // Delete the task from the database
        const deletedTask = await Task.findByIdAndDelete(taskId);

        if (!deletedTask) {
            return res.status(404).json({ message: 'Task not found' });
        }

        res.status(200).json({ message: 'Task deleted successfully' });
    } catch (error) {
        logger.error(`Error deleting task: ${error.message}`);
        handleError(res, error);
    }
}

