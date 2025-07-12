import express from "express";

import { createActivityLog } from "../controllers/activityLog.controller.js";

const router = express.Router();

router.post("/", createActivityLog);

export default router;