import express from 'express';
import { login, signUp, logout, changePassword, forgotPassword, resetPassword } from '../controllers/auth.controller.js';
import auth from '../middleware/authMiddleware.js';

const router = express.Router();

// Route for user login
router.post('/login', login);
// Route for user registration
router.post('/signUp', signUp)
// Route for user logout
router.post('/logout', logout)
// Route for changing password
router.post('/change-password', auth, changePassword);
// Route for initiating password reset
router.post('/forgot-password', forgotPassword);
// Route for resetting password
router.post('/reset-password/:token', resetPassword);

export default router;