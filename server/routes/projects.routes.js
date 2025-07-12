import express from "express";
import { createProject, getProjectById, updateProject, deleteProject } from "../controllers/projects.controller.js";

const router = express.Router();

// Route to create a new project
router.post("/", createProject);
// Route to get a project by ID
router.get("/:id", getProjectById);
// Route to update a project by ID
router.put("/:id", updateProject);
// Route to delete a project by ID
router.delete("/:id", deleteProject);

export default router;