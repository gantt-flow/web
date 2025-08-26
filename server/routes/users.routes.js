import express from "express";
import auth from '../middleware/authMiddleware.js';
import { getCurrentUser, getAllUsers,createUser, updateUser,deleteUser } from "../controllers/users.controller.js";

const router = express.Router();

router.get("/current", auth, getCurrentUser);
router.get("/", auth, getAllUsers);
router.post("/", auth, createUser);
router.put("/:id", auth, updateUser);
router.delete("/:id", auth, deleteUser);

export default router;