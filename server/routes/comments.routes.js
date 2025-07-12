import express from "express";
import { createComment, getCommentsByRelatedEntity, deleteComment, updateComment } from "../controllers/comments.controller.js";

const router = express.Router();

router.post("/", createComment);
router.get("/:relatedEntity", getCommentsByRelatedEntity);
router.delete("/:commentId", deleteComment);
router.put("/:commentId", updateComment);

export default router;