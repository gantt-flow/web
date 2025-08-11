import express from "express";
import auth from '../middleware/authMiddleware.js';
import { createAuditLog } from "../controllers/auditLog.controller.js";

const router = express.Router();

router.post("/", auth, createAuditLog);

export default router;