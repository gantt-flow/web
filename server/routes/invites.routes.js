import express from "express";
import auth from '../middleware/authMiddleware.js';
import { createInvite, acceptInvite, getInvite } from "../controllers/invites.controller.js";

const router = express.Router();

router.post("/", auth, createInvite);
router.get("/:token", getInvite);
router.post("/accept/:token", acceptInvite);

export default router;