import express from "express";
import auth from '../middleware/authMiddleware.js';
import { createTask, getTasksByProject, updateTask, deleteTask } from "../controllers/tasks.controller.js";


const router = express.Router();

// Route to create a new task
router.post("/", auth, createTask);
// Route to get tasks by project ID
router.get("/:projectId", auth, getTasksByProject);
// Route to update a task by ID
router.put("/:taskId", auth, updateTask);
// Route to delete a task by ID
router.delete("/:taskId", auth, deleteTask);


export default router;