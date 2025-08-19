import express from "express";
import auth from '../middleware/authMiddleware.js';

import { createUserAdmin } from "../controllers/admin.controller.js";

const router = express.Router();

router.post("/", createUserAdmin);

export default router;