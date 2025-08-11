import express from "express";
import auth from '../middleware/authMiddleware.js';
import { createAttachment, getAttachment, updateAttachment, deleteAttachment } from "../controllers/attachment.controller.js";

const router = express.Router();

router.post("/", auth, createAttachment);
router.get("/:id", auth, getAttachment);
router.put("/:id", auth, updateAttachment);
router.delete("/:id", auth, deleteAttachment);

export default router;