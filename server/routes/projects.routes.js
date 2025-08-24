import express from "express";
import auth from '../middleware/authMiddleware.js';
import { createProject, getProjectById, updateProject, deleteProject, getAllProjects } from "../controllers/projects.controller.js";

const router = express.Router();

// Route to create a new project
router.post("/", auth, createProject);
// Route to get a project by ID
router.get("/:id", auth, getProjectById);
// Route to update a project by ID
router.put("/:id", auth, updateProject);
// Route to delete a project by ID
router.delete("/:id", auth, deleteProject);
//Route to get all projects
router.get("/", auth, getAllProjects);

export default router;