import express from "express";
import { createInvite } from "../controllers/invites.controller.js";

const router = express.Router();

router.post("/", createInvite);

export default router;