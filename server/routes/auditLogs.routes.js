// server/routes/auditLog.routes.js
import express from "express";
import auth from '../middleware/authMiddleware.js';
import { getAuditLogs} from "../controllers/auditLog.controller.js";

const router = express.Router();

router.get("/", auth, getAuditLogs);

export default router;