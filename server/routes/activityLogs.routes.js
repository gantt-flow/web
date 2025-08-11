import express from "express";
import auth from '../middleware/authMiddleware.js';

import { createActivityLog } from "../controllers/activityLog.controller.js";

const router = express.Router();

router.post("/", auth, createActivityLog);

export default router;