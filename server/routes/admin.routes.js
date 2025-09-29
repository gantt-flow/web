import express from "express";
import authWithRole from '../middleware/authWithRole.js';
import { createUserAdmin, getAllUsers } from "../controllers/admin.controller.js";

const router = express.Router();

router.post("/",authWithRole('Administrador de sistema'), createUserAdmin);
router.get("/", authWithRole('Administrador de sistema','Auditor'), getAllUsers);

export default router;