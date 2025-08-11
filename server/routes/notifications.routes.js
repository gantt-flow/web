import express from "express";
import auth from '../middleware/authMiddleware.js';
import { createNotification, getNotificationsByRecipient } from "../controllers/notifications.controller.js";

const router = express.Router();

// Route to create a new notification
router.post("/", auth, createNotification);
// Route to get notifications by recipient ID
router.get("/:recipientId", auth, getNotificationsByRecipient);

export default router;