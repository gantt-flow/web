import express from "express";
import { createReminder, getRemindersByUser, deleteReminder, updateReminder, getReminderById } from "../controllers/reminders.controller.js";

const router = express.Router();

// Route to create a new reminder
router.post("/", createReminder);
// Route to get reminders by user ID
router.get("/:userId", getRemindersByUser);
// Route to delete a reminder by ID
router.delete("/:reminderId", deleteReminder);
// Route to update a reminder by ID
router.put("/:reminderId", updateReminder);
// Route to get a reminder by ID
router.get("/reminder/:reminderId", getReminderById);

export default router;