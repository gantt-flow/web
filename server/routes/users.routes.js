import express from "express";
import auth from '../middleware/authMiddleware.js';
import { getCurrentUser, createUser, updateUser,deleteUser, getUserWithId } from "../controllers/users.controller.js";

const router = express.Router();

router.get("/current", auth, getCurrentUser);
router.post("/", auth, createUser);
router.put("/:id", auth, updateUser);
router.delete("/:id", auth, deleteUser);
router.get("/:id", auth, getUserWithId);

export default router;