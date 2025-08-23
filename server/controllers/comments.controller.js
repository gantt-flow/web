import Comment from "../models/comment.js";
import { isValidObjectId } from "mongoose";
import { logger } from "../utils/logger.js";
import { generateAuditLog } from '../utils/auditService.js';

export const createComment = async (req, res) => {
    try {
        const { userId, comment, relatedEntity } = req.body;

        // Validate the userId and relatedEntity fields
        if (!isValidObjectId(userId) || !isValidObjectId(relatedEntity)) {
            return res.status(400).json({ message: 'Invalid user ID or related entity ID' });
        }

        // Validate the required fields
        if (!comment || !userId || !relatedEntity) {
            return res.status(400).json({ message: 'Fill all the required fields' });
        }

        // Create a new comment entry
        const newComment = new Comment({
            userId,
            comment,
            relatedEntity
        });

        await newComment.save();

        await generateAuditLog(req,'CREATE','Comment', newComment._id, `Comentario creado por usuario ${userId} en entidad ${relatedEntity}`);

        res.status(201).json({ message: 'Comment created successfully', comment: newComment });
    } catch (error) {
        logger.error(`Error creating comment: ${error.message}`);
        res.status(500).json({ message: 'Internal server error' });
    }
}

export const getCommentsByRelatedEntity = async (req, res) => {
    try {
        const { relatedEntity } = req.params;

        // Validate the relatedEntity ID
        if (!isValidObjectId(relatedEntity)) {
            return res.status(400).json({ message: 'Invalid related entity ID' });
        }

        // Fetch comments related to the specified entity
        const comments = await Comment.find({ relatedEntity }).populate('userId', 'name email');

        if (comments.length === 0) {
            return res.status(404).json({ message: 'No comments found for this entity' });
        }

        res.status(200).json(comments);
    } catch (error) {
        logger.error(`Error fetching comments: ${error.message}`);
        res.status(500).json({ message: 'Internal server error' });
    }
}

export const deleteComment = async (req, res) => {
    try {
        const { commentId } = req.params;

        // Validate the comment ID
        if (!isValidObjectId(commentId)) {
            return res.status(400).json({ message: 'Invalid comment ID' });
        }

        // Find and delete the comment
        const deletedComment = await Comment.findByIdAndDelete(commentId);

        if (!deletedComment) {
            return res.status(404).json({ message: 'Comment not found' });
        }

        await generateAuditLog(req, 'DELETE', 'Comment', commentId, `Comentario eliminado: "${commentId.comment.substring(0, 50)}${commentId.comment.length > 50 ? '...' : ''}"`);

        res.status(200).json({ message: 'Comment deleted successfully', comment: deletedComment });
    } catch (error) {
        logger.error(`Error deleting comment: ${error.message}`);
        res.status(500).json({ message: 'Internal server error' });
    }
}

export const updateComment = async (req, res) => {
    try {
        const { commentId } = req.params;
        const { comment } = req.body;

        // Validate the comment ID
        if (!isValidObjectId(commentId)) {
            return res.status(400).json({ message: 'Invalid comment ID' });
        }

        // Validate the comment field
        if (!comment) {
            return res.status(400).json({ message: 'Comment cannot be empty' });
        }

        // Update the comment in the database
        const updatedComment = await Comment.findByIdAndUpdate(commentId, { comment }, { new: true });

        if (!updatedComment) {
            return res.status(404).json({ message: 'Comment not found' });
        }

        await generateAuditLog(req,'UPDATE', 'Comment', commentId, `Comentario actualizado. Anterior: "${createComment.comment.substring(0, 50)}${createComment.comment.length > 50 ? '...' : ''}". Nuevo: "${comment.substring(0, 50)}${comment.length > 50 ? '...' : ''}"` );

        res.status(200).json({ message: 'Comment updated successfully', comment: updatedComment });
    } catch (error) {
        logger.error(`Error updating comment: ${error.message}`);
        res.status(500).json({ message: 'Internal server error' });
    }
}