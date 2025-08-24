import express from 'express';
import auth from '../middleware/authMiddleware.js';
import { login, signUp, logout, verifyAuth } from '../controllers/auth.controller.js';

const router = express.Router();

// Route for user login
router.post('/login', login);
// Route for user registration
router.post('/signUp', signUp)
// Route for user logout
router.post('/logout', logout)
// Route to verify authentication status
router.get('/verify', auth, verifyAuth);

export default router;