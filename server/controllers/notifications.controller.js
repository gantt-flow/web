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

export const getNotificationsByRecipient = async (req, res) => {
    try {
        const { recipientId } = req.params;

        // Validate the recipientId field
        if (!isValidObjectId(recipientId)) {
            return res.status(400).json({ message: 'Invalid recipient ID' });
        }

        // Fetch notifications for the specified recipient
        const notifications = await Notification.find({ recipientId }).populate('recipientId', 'name email');

        if (notifications.length === 0) {
            return res.status(404).json({ message: 'No notifications found for this recipient' });
        }

        res.status(200).json(notifications);
    } catch (error) {
        logger.error(`Error fetching notifications: ${error.message}`);
        res.status(500).json({ message: 'Internal server error' });
    }
}