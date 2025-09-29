import ActivityLog from "../models/activityLog.js";
import { isValidObjectId } from "mongoose";
import { logger } from '../utils/logger.js';


export const createActivityLog = async (req, res) => {
    try {
        const { userId, action, description, relatedEntity } = req.body;

        if (!userId || !action || !description || !relatedEntity || !relatedEntity.type || !relatedEntity.id) {
            return res.status(400).json({ message: 'Fill all required files' });
        }

        if (!isValidObjectId(userId)) {
            return res.status(400).json({ message: 'Invalid user ID' });
        }

        const activityLog = new ActivityLog({
            userId,
            action,
            description,
            relatedEntity
        });

        await activityLog.save();

        res.status(201).json({ message: 'Activity log created successfully', activityLog });
    } catch (error) {
        logger.error(`Error creating activity log: ${error.message}`);
        res.status(500).json({ message: 'Internal server error' });
    }
}