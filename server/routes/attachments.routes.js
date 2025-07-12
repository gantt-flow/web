import express from "express";
import { createAttachment, getAttachment, updateAttachment, deleteAttachment } from "../controllers/attachment.controller.js";

const router = express.Router();

router.post("/", createAttachment);
router.get("/:id", getAttachment);
router.put("/:id", updateAttachment);
router.delete("/:id", deleteAttachment);

export default router;