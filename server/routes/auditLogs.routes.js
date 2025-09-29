import express from "express";
import authWithRole from '../middleware/authWithRole.js';
import { getAuditLogs} from "../controllers/auditLog.controller.js";

const router = express.Router();

router.get("/", authWithRole('Administrador de sistema','Auditor'), getAuditLogs);

export default router;