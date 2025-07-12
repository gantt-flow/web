import Reminder from "../models/reminder.js";
import { isValidObjectId } from 'mongoose'; // Import Mongoose's isValidObjectId for ID validation
import { logger } from '../utils/logger.js';

export const createReminder = async (req, res) => {
    try {
        const { userId, title, description, dueDate } = req.body;

        // Validate the required fields
        if (!userId || !title || !dueDate) {
            return res.status(400).json({ message: 'Fill all the required fields' });
        }

        // Validate ObjectId for userId
        if (!isValidObjectId(userId)) {
            return res.status(400).json({ message: 'Invalid user ID' });
        }

        // Create a new reminder entry
        const newReminder = new Reminder({
            userId,
            title,
            description,
            dueDate
        });

        await newReminder.save();

        res.status(201).json({ message: 'Reminder created successfully', reminder: newReminder });
    } catch (error) {
        logger.error(`Error creating reminder: ${error.message}`);
        res.status(500).json({ message: 'Internal server error' });
    }
}

export const getRemindersByUser = async (req, res) => {
    try {
        const { userId } = req.params;

        // Validate the user ID
        if (!isValidObjectId(userId)) {
            return res.status(400).json({ message: 'Invalid user ID' });
        }

        // Fetch reminders for the specified user
        const reminders = await Reminder.find({ userId }).populate('userId', 'name email');

        if (reminders.length === 0) {
            return res.status(404).json({ message: 'No reminders found for this user' });
        }

        res.status(200).json(reminders);
    } catch (error) {
        logger.error(`Error fetching reminders: ${error.message}`);
        res.status(500).json({ message: 'Internal server error' });
    }
}

export const deleteReminder = async (req, res) => {
    try {
        const { reminderId } = req.params;

        // Validate the reminder ID
        if (!isValidObjectId(reminderId)) {
            return res.status(400).json({ message: 'Invalid reminder ID' });
        }

        // Delete the reminder
        const result = await Reminder.findByIdAndDelete(reminderId);

        if (!result) {
            return res.status(404).json({ message: 'Reminder not found' });
        }

        res.status(200).json({ message: 'Reminder deleted successfully' });
    } catch (error) {
        logger.error(`Error deleting reminder: ${error.message}`);
        res.status(500).json({ message: 'Internal server error' });
    }
}

export const updateReminder = async (req, res) => {
    try {
        const { reminderId } = req.params;
        const updateData = req.body;

        // Validate the reminder ID
        if (!isValidObjectId(reminderId)) {
            return res.status(400).json({ message: 'Invalid reminder ID' });
        }

        // Update the reminder
        const updatedReminder = await Reminder.findByIdAndUpdate(reminderId, updateData, { new: true });

        if (!updatedReminder) {
            return res.status(404).json({ message: 'Reminder not found' });
        }

        res.status(200).json({ message: 'Reminder updated successfully', reminder: updatedReminder });
    } catch (error) {
        logger.error(`Error updating reminder: ${error.message}`);
        res.status(500).json({ message: 'Internal server error' });
    }
}

export const getReminderById = async (req, res) => {
    try {
        const { reminderId } = req.params;

        // Validate the reminder ID
        if (!isValidObjectId(reminderId)) {
            return res.status(400).json({ message: 'Invalid reminder ID' });
        }

        // Fetch the reminder by ID
        const reminder = await Reminder.findById(reminderId).populate('userId', 'name email');

        if (!reminder) {
            return res.status(404).json({ message: 'Reminder not found' });
        }

        res.status(200).json(reminder);
    } catch (error) {
        logger.error(`Error fetching reminder: ${error.message}`);
        res.status(500).json({ message: 'Internal server error' });
    }
}