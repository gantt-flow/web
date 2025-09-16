import Notification from "../models/notification.js";
import { isValidObjectId } from "mongoose";
import { logger } from "../utils/logger.js";
import { generateAuditLog } from '../utils/auditService.js';

export const createNotification = async (req, res) => {
    try {
        const { recipientId, title, message } = req.body;

        // Validate the recipientId field
        if (!isValidObjectId(recipientId)) {
            return res.status(400).json({ message: 'Invalid recipient ID' });
        }

        // Validate the required fields
        if (!title || !message || !recipientId) {
            return res.status(400).json({ message: 'Fill all the required fields' });
        }

        // Create a new notification entry
        const newNotification = new Notification({
            recipientId,
            title,
            message
        });

        await newNotification.save();

        await generateAuditLog(req, 'CREATE', 'Notification',newNotification._id,`Notificación creada para el usuario ${recipientId}: "${title}"`);

        res.status(201).json({ message: 'Notification created successfully', notification: newNotification });
    } catch (error) {
        logger.error(`Error creating notification: ${error.message}`);
        res.status(500).json({ message: 'Internal server error' });
    }
}

export const getAllNotificationsByUser = async (req, res) => {
    try {
        const recipientId = req.user._id;

        // Validate the recipientId field
        if (!isValidObjectId(recipientId)) {
            return res.status(400).json({ message: 'Invalid recipient ID' });
        }

        // Fetch notifications for the specified recipient
        const notifications = await Notification.find({ recipientId }).populate('recipientId', 'name email');

        if (notifications.length === 0) {
            return res.status(200).json({ message: 'No notifications found for this recipient' });
        }

        res.status(200).json(notifications);
    } catch (error) {
        logger.error(`Error fetching notifications: ${error.message}`);
        res.status(500).json({ message: 'Internal server error' });
    }
}


export const updateNotificationStatus = async (req, res) => {
    try {
        const { notificationId } = req.params;

        if (!isValidObjectId(notificationId)) {
            return res.status(400).json({ message: 'Invalid notification ID format.' });
        }
    
        const updatedNotification = await Notification.findByIdAndUpdate(
            notificationId,
            { isRead: true },
            { new: true }
        );

        if (!updatedNotification) {
            return res.status(404).json({ message: 'Notification not found' });
        }
        
        await generateAuditLog(req, 'UPDATE', 'Notification', notificationId, `Notification marked as read: "${updatedNotification.title}"`);

        res.status(200).json({ 
            message: 'Notification updated successfully', 
            notification: updatedNotification 
        });

    } catch (error) {
        logger.error(`Error updating notification status: ${error.message}`);
        res.status(500).json({ message: 'Internal server error' });
    }
};


export const markAllAsRead = async (req, res) => {
    try {
        const recipientId = req.user._id;

        // Usamos updateMany para actualizar todos los documentos que coincidan
        const updateResult = await Notification.updateMany(
            { recipientId: recipientId, isRead: false }, // Condición: solo las no leídas del usuario
            { $set: { isRead: true } } // Acción: marcar como leídas
        );

        if (updateResult.modifiedCount === 0) {
            return res.status(200).json({ message: 'No hay notificaciones nuevas para marcar como leídas.' });
        }

        await generateAuditLog(req, 'UPDATE', 'Notification', recipientId, `Todas las notificaciones marcadas como leídas`);

        res.status(200).json({ 
            message: `${updateResult.modifiedCount} notificaciones marcadas como leídas.`,
            count: updateResult.modifiedCount 
        });

    } catch (error) {
        logger.error(`Error marcando todas las notificaciones como leídas: ${error.message}`);
        res.status(500).json({ message: 'Internal server error' });
    }
};