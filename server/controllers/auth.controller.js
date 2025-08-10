import express from 'express';
import bycript from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/User.js'; 

// @route   POST /api/auth/login
// @desc    Autentica un usuario y devuelve un token en una cookie
// @access  Publico
export const login = async (req, res) => {

    const { email, password } = req.body;

    try {
        // Check if user exists by email
        const user = await User.findOne({ email });

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Verify password
        const isMatch = await bycript.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        // Generate JWT token
        const payload = {
            user: {
                id: user.id
            }
        };

        // Respond with token and user info
        jwt.sign(
            payload,
            process.env.JWT_SECRET,
            { expiresIn: '1h' },
            (err, token) => {
                if (err) throw err;

                // Token is sent as cookie and not in the response body
                // The cookie is named 'token' y has the JWT
                res.cookie('token', token, {
                    httpOnly: true, // Cookie cannot be accessed by JavaScript!
                    secure: process.env.NODE_ENV === 'production', // true in production (HTTPS), false in development (HTTP)
                    sameSite: 'strict' // Protection agains CSRF attacks
                });

                // Response is sent to the client without the token in the body
                res.status(200).json({ msg: 'Inicio de sesión exitoso' });
            }
        );

    } catch (err) {
        console.error(err.message);
        res.status(500).json({ message: 'Server error' });
    }
};