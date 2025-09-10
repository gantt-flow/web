import express from "express";
import auth from '../middleware/authMiddleware.js';
import { createComment, getCommentsByTask, deleteComment, updateComment } from "../controllers/comments.controller.js";

const router = express.Router();

router.post("/", auth, createComment);
router.get("/task/:taskId", auth, getCommentsByTask);
router.delete("/:commentId", auth, deleteComment);
router.put("/:commentId", auth, updateComment);

export default router;