import Reminder from "../models/reminder.js";
import { isValidObjectId } from 'mongoose';
import { logger } from '../utils/logger.js';

export const createReminder = async (req, res) => {
    try {
        const { userId, title, description, dueDate } = req.body;

        if (!userId || !title || !dueDate) {
            return res.status(400).json({ message: 'Fill all the required fields' });
        }

        if (!isValidObjectId(userId)) {
            return res.status(400).json({ message: 'Invalid user ID' });
        }

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

        if (!isValidObjectId(userId)) {
            return res.status(400).json({ message: 'Invalid user ID' });
        }

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

        if (!isValidObjectId(reminderId)) {
            return res.status(400).json({ message: 'Invalid reminder ID' });
        }

       
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

      
        if (!isValidObjectId(reminderId)) {
            return res.status(400).json({ message: 'Invalid reminder ID' });
        }

       
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

    
        if (!isValidObjectId(reminderId)) {
            return res.status(400).json({ message: 'Invalid reminder ID' });
        }

       
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