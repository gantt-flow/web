import express from "express";
import auth from '../middleware/authMiddleware.js';
import {
            createProject, 
            getProjectById, 
            updateProject, 
            deleteProject, 
            getAllProjects, 
            getCurrentUserProjects, 
            addMemberToProject, 
            removeMemberFromProject, 
            addProjectManagerToProject,
            getTeamMembers,
            getActiveProjectTasks
        } from "../controllers/projects.controller.js";

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
// Route to get projects of the current user
router.get("/current/user/:id", auth, getCurrentUserProjects)
// Route to add a member to a project
router.post("/:projectId/members", auth, addMemberToProject);
// Route to remove a member from a project
router.delete("/:projectId/members/:memberId", auth, removeMemberFromProject);
// Route to add project to user
router.post("/addProjectManagerToProject/:projectId", auth, addProjectManagerToProject)
// Route to get team members of a project
router.get("/getTeamMembers/:id", auth, getTeamMembers);
// Route to get project tasks
router.get("/getProjectTasks/:id", auth, getActiveProjectTasks);

export default router;