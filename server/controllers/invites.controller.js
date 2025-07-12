import Invite from "../models/invite.js";
import { isValidObjectId } from "mongoose";
import { logger } from "../utils/logger.js";

export const createInvite = async (req, res) => {
    try {
        const { email, invitedBy, projectId, role, token, expiresAt } = req.body;

        // Validate the required fields
        if (!email || !invitedBy || !projectId || !role || !token || !expiresAt) {
            return res.status(400).json({ message: 'Fill all the required fields' });
        }

        // Validate ObjectIds
        if (!isValidObjectId(invitedBy) || !isValidObjectId(projectId)) {
            return res.status(400).json({ message: 'Invalid user ID or project ID' });
        }

        // Create a new invite entry
        const newInvite = new Invite({
            email,
            invitedBy,
            projectId,
            role,
            token,
            expiresAt
        });

        await newInvite.save();

        res.status(201).json({ message: 'Invite created successfully', invite: newInvite });
    } catch (error) {
        logger.error(`Error creating invite: ${error.message}`);
        res.status(500).json({ message: 'Internal server error' });
    }
}