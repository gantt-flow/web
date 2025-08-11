import express from "express";
import auth from '../middleware/authMiddleware.js';
import { createComment, getCommentsByRelatedEntity, deleteComment, updateComment } from "../controllers/comments.controller.js";

const router = express.Router();

router.post("/", auth, createComment);
router.get("/:relatedEntity", auth, getCommentsByRelatedEntity);
router.delete("/:commentId", auth, deleteComment);
router.put("/:commentId", auth, updateComment);

export default router;