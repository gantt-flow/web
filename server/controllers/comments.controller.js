import Comment from "../models/comment.js";
import Task from "../models/task.js";
import { isValidObjectId } from "mongoose";
import { logger } from "../utils/logger.js";
import { generateAuditLog } from '../utils/auditService.js';

export const createComment = async (req, res) => {
    try {
        const { comment, relatedEntity } = req.body;

        const userId = req.user._id;

     
        if (!isValidObjectId(userId) || !isValidObjectId(relatedEntity)) {
            return res.status(400).json({ message: 'Invalid user ID or related entity ID' });
        }

        if (!comment || !userId || !relatedEntity ) {
            return res.status(400).json({ message: 'Fill all the required fields' });
        }


        const newComment = new Comment({
            userId,
            comment,
            relatedEntity,
        });

        await newComment.save();

        await Task.findByIdAndUpdate(
            relatedEntity, 
            { $push: { comments: newComment._id } } 
        );

        await generateAuditLog(req,'CREATE','Comment', newComment._id, `Comentario creado por usuario ${userId} en entidad ${relatedEntity}`);

        const populatedComment = await Comment.findById(newComment._id)
            .populate('userId', 'name email');

        await generateAuditLog(req, 'CREATE', 'Comment', newComment._id, `Comentario creado en la entidad ${relatedEntity}`);
        
        res.status(201).json(populatedComment);
    } catch (error) {
        logger.error(`Error creating comment: ${error.message}`);
        res.status(500).json({ message: 'Internal server error' });
    }
}

export const getCommentsByTask = async (req, res) => {
    try {
        const { taskId } = req.params;

        if (!isValidObjectId(taskId)) {
            return res.status(400).json({ message: 'ID de Tarea no válido' });
        }

        const comments = await Comment.find({ relatedEntity: taskId })
            .populate('userId', 'name email') 
            .sort({ createdAt: 'desc' }); 

        res.status(200).json(comments);

    } catch (error) {
        logger.error(`Error fetching comments for task: ${error.message}`);
    }
}

// --- 🚀 FIX: Lógica de Actualización Segura ---
export const updateComment = async (req, res) => {
    try {
        const { commentId } = req.params;
        const { comment } = req.body;
        const userId = req.user._id;

        if (!isValidObjectId(commentId)) {
            return res.status(400).json({ message: 'ID de comentario no válido' });
        }
        if (!comment) {
            return res.status(400).json({ message: 'El comentario no puede estar vacío' });
        }

        const existingComment = await Comment.findById(commentId);
        if (!existingComment) {
            return res.status(404).json({ message: 'Comentario no encontrado' });
        }

        // Comprobación de autorización: solo el autor puede editar
        if (existingComment.userId.toString() !== userId.toString()) {
            return res.status(403).json({ message: 'No autorizado para editar este comentario' });
        }

        existingComment.comment = comment;
        await existingComment.save();
        
        const populatedComment = await Comment.findById(existingComment._id).populate('userId', 'name email');

        res.status(200).json(populatedComment);
    } catch (error) {
        logger.error(`Error al actualizar el comentario: ${error.message}`);
        res.status(500).json({ message: 'Error interno del servidor' });
    }
};

// --- 🚀 FIX: Lógica de Eliminación Segura ---
export const deleteComment = async (req, res) => {
    try {
        const { commentId } = req.params;
        const userId = req.user._id;

        if (!isValidObjectId(commentId)) {
            return res.status(400).json({ message: 'ID de comentario no válido' });
        }

        const commentToDelete = await Comment.findById(commentId);
        if (!commentToDelete) {
            return res.status(404).json({ message: 'Comentario no encontrado' });
        }
        
        // Comprobación de autorización: solo el autor puede eliminar
        if (commentToDelete.userId.toString() !== userId.toString()) {
             return res.status(403).json({ message: 'No autorizado para eliminar este comentario' });
        }

        await Comment.findByIdAndDelete(commentId);

        // También eliminamos la referencia del comentario en la tarea
        await Task.findByIdAndUpdate(commentToDelete.relatedEntity, {
            $pull: { comments: commentToDelete._id }
        });

        res.status(200).json({ message: 'Comentario eliminado exitosamente' });
    } catch (error) {
        logger.error(`Error al eliminar el comentario: ${error.message}`);
        res.status(500).json({ message: 'Error interno del servidor' });
    }
};