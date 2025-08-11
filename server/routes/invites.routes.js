import express from "express";
import auth from '../middleware/authMiddleware.js';
import { createInvite } from "../controllers/invites.controller.js";

const router = express.Router();

router.post("/", auth, createInvite);

export default router;