import AuditLog from "../models/auditLog.js";
import { isValidObjectId } from "mongoose";
import { logger } from "../utils/logger.js";

export const createAuditLog = async (req, res) => {
    try {
        const { action, details, relatedEntity, performedBy, ipAddress, device } = req.body;

        // Validate the performedBy field
        if (!isValidObjectId(performedBy)) {
            return res.status(400).json({ message: 'Invalid user ID' });
        }

        // Validate the required fields
        if (!action || !relatedEntity || !performedBy) {
            return res.status(400).json({ message: 'Fill all the required fields' });
        }

        // Create a new audit log entry
        const newAuditLog = new AuditLog({
            action,
            details,
            relatedEntity,
            performedBy,
            ipAddress,
            device
        });

        await newAuditLog.save();

        res.status(201).json({ message: 'Audit log created successfully', auditLog: newAuditLog });
    } catch (error) {
        logger.error(`Error creating audit log: ${error.message}`);
        res.status(500).json({ message: 'Internal server error' });
    }
}