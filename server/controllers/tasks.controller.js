import Task from "../models/task.js";
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
            attachments,  // TODO
            tags, 
            type 
        } = req.body;

        // Se obtiene el id de quien creo la tarea según quien este autenticado
        const createdBy = req.user._id; 

        // Validar los campos requeridos
        if (!title || !startDate || !dueDate || !assignedTo || !projectId || !createdBy || !type) {
            return res.status(400).json({ message: 'Fill all the required fields' });
        }

        // Validar ObjectIds
        if (!isValidObjectId(assignedTo) || !isValidObjectId(projectId) || !isValidObjectId(createdBy)) {
            return res.status(400).json({ message: 'Invalid user ID or project ID' });
        }

        // Crear la tarea
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
            type
        });

        // Se guarda la tarea en la base de datos
        await newTask.save();
        
        // Si se mando un comentario, crearlo ahora que ya se tiene el id de la tareas
        if (comments && typeof comments === 'string' && comments.trim() !== '') {
            // Se hace una solicitud y respuesta simuladas para llamar a createComment
            const mockReq = {
                body: {
                    userId: req.user, // El usuario autenticado
                    comment: comments, // El texto del comentario
                    relatedEntity: newTask._id,  // El ID de la tarea que se creo
                },
            };

            // Se crea un objeto de respuesta simulado. Solo necesita tener los métodos que `createComment` pueda llamar.
            const mockRes = {
                // Se captura el resultado para poder obtener el ID del nuevo comentario
                commentData: null,
                statusCode: null,
                status: function(code) {
                    this.statusCode = code;
                    return this; // Permitir encadenamiento como res.status(201).json(...)
                },
                json: function(data) {
                    this.commentData = data.comment;
                }
            };

            try {
                // Se llama la función del controlador de comentarios
                await createComment(mockReq, mockRes);
                
                // Si el comentario se creó con éxito, se añade su ID a la tarea
                if (mockRes.statusCode === 201 && mockRes.commentData) {
                    newTask.comments.push(mockRes.commentData._id);
                    await newTask.save(); // Se guarda la tarea con el id ya del comentario
                }
            } catch (commentError) {
                // Si la creación del comentario falla,se registra pero no se detiene la respuesta principal,
                // Solo se advierte, faltaría poner que hacer si no se crea el comentario - TODO
                logger.warn(`Task ${newTask._id} created, but failed to add initial comment: ${commentError.message}`);
            }
        }

        await generateAuditLog(req, 'CREATE', 'Task', newTask._id, `Tarea creada: "${title}"`);

        // Se enviar la respuesta exitosa
        // Poblamos los datos antes de enviarlos para una respuesta más completa
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

        // Validate the task ID
        if (!isValidObjectId(taskId)) {
            return res.status(400).json({ message: 'Invalid task ID' });
        }

        // Delete the task from the database
        const deletedTask = await Task.findByIdAndDelete(taskId);

        if (!deletedTask) {
            return res.status(404).json({ message: 'Task not found' });
        }

        await generateAuditLog(req, 'DELETE', 'Task', taskId, `Tarea eliminada: "${Task.title}" - Proyecto: ${Task.projectId} - Asignada a: ${Task.assignedTo}`);

        res.status(200).json({ message: 'Task deleted successfully' });
    } catch (error) {
        logger.error(`Error deleting task: ${error.message}`);
        handleError(res, error);
    }
}

