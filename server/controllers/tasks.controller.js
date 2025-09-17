import Task from "../models/task.js";
import Project from "../models/project.js";
import Notification from "../models/notification.js";
import User from "../models/user.js";
import { isValidObjectId } from "mongoose";
import { logger } from "../utils/logger.js";
import { handleError } from "../utils/errorHandler.js";
import { generateAuditLog } from '../utils/auditService.js';
import { createComment } from "./comments.controller.js";

export const createTask = async (req, res) => {
     try {
        const { 
            title, 
            description, 
            startDate, 
            dueDate,
            status, 
            priority, 
            assignedTo, 
            projectId, 
            dependencies, 
            estimatedHours,
            comments, 
            attachments,
            tags,
            type, 
            typeTask
        } = req.body;

        const createdBy = req.user._id; 

        if (!title || !startDate || !dueDate || !assignedTo || !projectId || !createdBy || !typeTask  || !type) {
            return res.status(400).json({ message: 'Fill all the required fields' });
        }

        if (!isValidObjectId(assignedTo) || !isValidObjectId(projectId) || !isValidObjectId(createdBy)) {
            return res.status(400).json({ message: 'Invalid user ID or project ID' });
        }

        const newTask = new Task({
            title,
            description,
            startDate,
            dueDate,
            status,
            priority,
            assignedTo,
            projectId,
            dependencies,
            estimatedHours,
            createdBy,
            tags,
            type,
            typeTask  
        });

        const savedTask = await newTask.save();

        await Project.findByIdAndUpdate(
            projectId,
            { $push: { tasks: savedTask._id } },
            { new: true }
        );

        // --- INICIO: Lógica para crear notificación ---
        // 3. Verificamos que la tarea fue asignada a alguien y que no es el mismo usuario que la creó.
        if (savedTask.assignedTo && savedTask.createdBy.toString() !== savedTask.assignedTo.toString()) {
            try {
                // Buscamos el nombre de quien creó la tarea para un mensaje más claro
                const creator = await User.findById(savedTask.createdBy).select('name');
                const creatorName = creator ? creator.name : 'Alguien';

                const notification = new Notification({
                    recipientId: savedTask.assignedTo,
                    title: 'Nueva Tarea Asignada',
                    message: `${creatorName} te ha asignado la tarea: "${savedTask.title}"`
                });
                await notification.save();
            } catch (notificationError) {
                logger.error(`Error al crear la notificación para la tarea ${savedTask._id}: ${notificationError.message}`);
                // No detenemos el proceso, la tarea ya se creó. Solo registramos el error.
            }
        }
        // --- FIN: Lógica para crear notificación ---
        
        if (comments && typeof comments === 'string' && comments.trim() !== '') {
            const mockReq = {
                body: {
                    userId: req.user,
                    comment: comments,
                    relatedEntity: newTask._id,
                },
            };
            const mockRes = {
                commentData: null,
                statusCode: null,
                status: function(code) {
                    this.statusCode = code;
                    return this;
                },
                json: function(data) {
                    this.commentData = data.comment;
                }
            };
            try {
                await createComment(mockReq, mockRes);
                if (mockRes.statusCode === 201 && mockRes.commentData) {
                    newTask.comments.push(mockRes.commentData._id);
                    await newTask.save();
                }
            } catch (commentError) {
                logger.warn(`Task ${newTask._id} created, but failed to add initial comment: ${commentError.message}`);
            }
        }

        await generateAuditLog(req, 'CREATE', 'Task', newTask._id, `Tarea creada: "${title}"`);

        const populatedTask = await Task.findById(newTask._id)
            .populate('assignedTo', 'name email')
            .populate('createdBy', 'name email');

        res.status(201).json({ message: 'Task created successfully', task: populatedTask });

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

        
       // await generateAuditLog(req, 'UPDATE', 'Task', taskId, `Tarea actualizada: "${currentTask.title}". Cambios: ${changes.join(', ')}`);

        res.status(200).json({ message: 'Task updated successfully', task: updatedTask });
    } catch (error) {
        logger.error(`Error updating task: ${error.message}`);
        handleError(res, error);
    }
}

export const deleteTask = async (req, res) => {
    try {
        const { taskId } = req.params;

        if (!isValidObjectId(taskId)) {
            return res.status(400).json({ message: 'Invalid task ID' });
        }

        const deletedTask = await Task.findByIdAndDelete(taskId);

        if (!deletedTask) {
            return res.status(404).json({ message: 'Task not found' });
        }

        if (deletedTask.projectId) {
            await Project.findByIdAndUpdate(
                deletedTask.projectId,
                { $pull: { tasks: deletedTask._id } } // Use $pull to remove the ID
            );
        }       

        await generateAuditLog(req, 'DELETE', 'Task', taskId, `Tarea eliminada: "${deletedTask.title}"`);

        res.status(200).json({ message: 'Task deleted successfully' });
    } catch (error) {
        logger.error(`Error deleting task: ${error.message}`);
        handleError(res, error);
    }
}
