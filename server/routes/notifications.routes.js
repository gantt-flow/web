import express from "express";
import { createNotification, getNotificationsByRecipient } from "../controllers/notifications.controller.js";

const router = express.Router();

// Route to create a new notification
router.post("/", createNotification);
// Route to get notifications by recipient ID
router.get("/:recipientId", getNotificationsByRecipient);

export default router;