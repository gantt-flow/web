import express from "express";
import { createAuditLog } from "../controllers/auditLog.controller.js";

const router = express.Router();

router.post("/", createAuditLog);

export default router;