import express from "express";
import { createTask, getTasksByProject, updateTask, deleteTask } from "../controllers/tasks.controller.js";

const router = express.Router();

// Route to create a new task
router.post("/", createTask);
// Route to get tasks by project ID
router.get("/:projectId", getTasksByProject);
// Route to update a task by ID
router.put("/:taskId", updateTask);
// Route to delete a task by ID
router.delete("/:taskId", deleteTask);

export default router;