import express from "express";
import auth from '../middleware/authMiddleware.js';
import { createReminder, getRemindersByUser, deleteReminder, updateReminder, getReminderById } from "../controllers/reminders.controller.js";

const router = express.Router();

// Route to create a new reminder
router.post("/", auth, createReminder);
// Route to get reminders by user ID
router.get("/:userId", auth, getRemindersByUser);
// Route to delete a reminder by ID
router.delete("/:reminderId", auth, deleteReminder);
// Route to update a reminder by ID
router.put("/:reminderId", auth, updateReminder);
// Route to get a reminder by ID
router.get("/reminder/:reminderId", auth, getReminderById);

export default router;