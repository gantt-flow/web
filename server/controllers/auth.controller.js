import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/user.js'; 
import { comparePassword } from '../utils/passwordUtils.js';


/**
 * @desc    Authenticates a user and returns a token in a cookie.
 * @route   POST /auth/login
 * @access  Public
 */
export const login = async (req, res) => {
    // Destructure email and password from the request body.
    const { email, password } = req.body;

    try {
        // Find the user in the database by their email.
        const user = await User.findOne({ email });

        // If no user is found, send a generic error message.
        // It's a security best practice to not specify whether the email or password was wrong.
        if (!user) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        // Compare the provided password with the hashed password stored in the database.
        const isMatch = await comparePassword(password, user.passwordHash);

        // If the passwords do not match, send the same generic error message.
        if (!isMatch) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        // Create the payload for the JWT, containing non-sensitive user data.
        const payload = {
            user: {
                _id: user.id,
                email: user.email,
                name: user.name,
                role: user.role
            }
        };

        // Sign the JWT.
        jwt.sign(
            payload, // The data to include in the token
            process.env.JWT_SECRET, // The secret key for signing
            { expiresIn: '1h' }, // Token expiration time
            (err, token) => { // Callback function after signing is complete
                if (err) throw err;

                // Set the token in an HTTP-only cookie for security.
                res.cookie('token', token, {
                    httpOnly: true, // Prevents client-side JavaScript from accessing the cookie
                    secure: process.env.NODE_ENV === 'production', // Only sends the cookie over HTTPS in production
                    sameSite: 'strict' // Helps mitigate CSRF attacks
                });

                // Send a success response with user data.
                res.status(200).json({ 
                    msg: 'Login successful'
                });
            }
        );

    } catch (err) {
        // Log and send a generic server error if anything goes wrong.
        console.error(err.message);
        res.status(500).json({ message: 'Server error'});
    }
};


/**
 * @desc    Registers a new user.
 * @route   POST /auth/signup
 * @access  Public
 */
export const signUp = async (req, res) => {
    // 1. Destructure user details from the request body.
    const { name, email, password, role } = req.body;

    try {
        // 2. Check if a user with the provided email already exists.
        const existingUser = await User.findOne({ email });

        if (existingUser) {
            return res.status(400).json({ message: 'User already exists' });
        }

        // 3. Create a new user instance (but don't save it yet).
        const newUser = new User({
            name,
            email,
            passwordHash: password, // Temporarily assign the plain password
            role,
        });

        // 4. Hash the password for secure storage.
        // Generate a "salt" to add randomness to the hash.
        const salt = await bcrypt.genSalt(10);
        // Overwrite the plain password with the newly created hash.
        newUser.passwordHash = await bcrypt.hash(password, salt);

        // 5. Save the new user document to the database.
        await newUser.save();

        // 6. Send a success response.
        res.status(201).json({ message: 'User registered successfully' });
    } catch (err) {
        // Log and send a generic server error if anything fails.
        console.error(err.message);
        res.status(500).json({ message: 'Server error' });
    }
};

/**
 * @desc    Logs the user out by clearing the cookie.
 * @route   POST /auth/logout
 * @access  Private (requires user to be logged in)
 */
export const logout = async (req, res) => {
    try {
        // Use the `clearCookie` method to instruct the browser to delete the 'token' cookie.
        // This effectively ends the user's session.
        res.clearCookie('token');
        
        // 2. Send a success response to confirm the logout.
        res.status(200).json({ message: 'Logout successful' });
    } catch (err) {
        // Log and send a generic server error if anything goes wrong.
        console.error(err.message);
        res.status(500).json({ message: 'Server error' });
    }
};
