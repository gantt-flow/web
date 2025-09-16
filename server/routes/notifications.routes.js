import express from "express";
import auth from '../middleware/authMiddleware.js';
import { createNotification, getAllNotificationsByUser, updateNotificationStatus, markAllAsRead } from "../controllers/notifications.controller.js";

const router = express.Router();

// Route to create a new notification
router.post("/", auth, createNotification);
// Route to get notifications by recipient ID
router.get("/", auth, getAllNotificationsByUser);
// Route to update notification status
router.put("/:notificationId/read", auth, updateNotificationStatus);
router.put("/read-all", auth, markAllAsRead);

export default router;