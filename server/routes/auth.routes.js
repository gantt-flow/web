import express from 'express';
import { login, signUp, logout } from '../controllers/auth.controller.js';

const router = express.Router();

// Route for user login
router.post('/login', login);
// Route for user registration
router.post('/signUp', signUp)
// Route for user logout
router.post('/logout', logout)

export default router;