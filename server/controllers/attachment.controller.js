import Attachment from "../models/attachment.js";
import { isValidObjectId } from "mongoose";
import { logger } from "../utils/logger.js";
import { generateAuditLog } from '../utils/auditService.js';

export const createAttachment = async (req, res) => {
    try {
        const { fileName, fileType, fileSize, filePath, uploadedBy } = req.body;

        // Validate the attachment data
        if (!fileName || !fileType || !fileSize || !filePath || !uploadedBy) {
            return res.status(400).json({ message: 'Fill all the required fields' });
        }

        // Validate the uploadedBy field
        if (!isValidObjectId(uploadedBy)) {
            return res.status(400).json({ message: 'Invalid user ID' });
        }

        // Create a new attachment in the database
        const newAttachment = new Attachment({
            fileName,
            fileType,
            fileSize,
            filePath,
            uploadedBy: req.user._id // Assuming req.user is set by authentication middleware
        });

        await newAttachment.save();

        res.status(201).json({ message: 'Attachment created successfully', attachment: newAttachment });
    } catch (error) {
        logger.error(`Error creating attachment: ${error.message}`);
        res.status(500).json({ message: 'Internal server error' });
    }
}


export const getAttachment = async (req, res) => {
    try {
        const attachmentId = req.params.id;
        // Validate the attachment ID
        if (!isValidObjectId(attachmentId)) {
            return res.status(400).json({ message: 'Invalid attachment ID' });
        }       
        // Fetch the attachment from the database
        const attachment = await Attachment.findById(attachmentId);
        if (!attachment) {
            return res.status(404).json({ message: 'Attachment not found' });
        }
        res.status(200).json(attachment);
    } catch (error) {
        logger.error(`Error fetching attachment: ${error.message}`);
        res.status(500).json({ message: 'Internal server error' });
    }
}  


export const updateAttachment = async (req, res) => {
    try {
        const attachmentId = req.params.id;
        const { fileName, fileType, fileSize, filePath } = req.body;

        // Validate the attachment ID
        if (!isValidObjectId(attachmentId)) {
            return res.status(400).json({ message: 'Invalid attachment ID' });
        }

        // Fetch the attachment from the database
        const attachment = await Attachment.findById(attachmentId);
        if (!attachment) {
            return res.status(404).json({ message: 'Attachment not found' });
        }

        // Update the attachment fields
        if (fileName) attachment.fileName = fileName;
        if (fileType) attachment.fileType = fileType;
        if (fileSize) attachment.fileSize = fileSize;
        if (filePath) attachment.filePath = filePath;

        await attachment.save();

        res.status(200).json({ message: 'Attachment updated successfully', attachment });
    } catch (error) {
        logger.error(`Error updating attachment: ${error.message}`);
        res.status(500).json({ message: 'Internal server error' });
    }
}


export const deleteAttachment = async (req, res) => {
    try {
        const attachmentId = req.params.id;

        // Validate the attachment ID
        if (!isValidObjectId(attachmentId)) {
            return res.status(400).json({ message: 'Invalid attachment ID' });
        }

        // Fetch the attachment from the database
        const attachment = await Attachment.findById(attachmentId);
        if (!attachment) {
            return res.status(404).json({ message: 'Attachment not found' });
        }

        // Delete the attachment
        await Attachment.findByIdAndDelete(attachmentId);

        res.status(200).json({ message: 'Attachment deleted successfully' });
    } catch (error) {
        logger.error(`Error deleting attachment: ${error.message}`);
        res.status(500).json({ message: 'Internal server error' });
    }
}