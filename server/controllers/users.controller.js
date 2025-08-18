import User from '../models/user.js';
import { isValidObjectId } from 'mongoose'; // Import Mongoose's isValidObjectId for ID validation
import { logger } from '../utils/logger.js';
import bcrypt from 'bcryptjs';


export const getUser = async (req, res) => {
    try {
        const userId = req.params.id;

        // Validate the user ID
        if (!isValidObjectId(userId)) {
            return res.status(400).json({ message: 'Invalid user ID' });
        }

        // Fetch the user from the database
        const user = await User.findById(userId).select('-passwordHash'); // Exclude password and version field
        
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        res.status(200).json(user);
    } catch (error) {
        logger.error(`Error fetching user by ID: ${error.message}`);
        handleError(res, error);
    }
}

export const getAllUsers = async (req, res) => {
  try {
    const { page = 1, limit = 10, role } = req.query;
    const filter = role ? { role } : {};
    const users = await User.find(filter)
      .select('name email role isActive createdAt updatedAt')
      .skip((page - 1) * limit)
      .limit(Number(limit));
    res.status(200).json(users);
  } catch (error) {
    logger.error(`Error fetching users: ${error.message}`);
    handleError(res, error);
  }
}

export const createUser = async (req, res) => {
    try {
        const userData = req.body;

        // Validate the user data
        if (!userData.name || !userData.email || !userData.password || !userData.role) {
            return res.status(400).json({ message: 'Fill all the required fields' });
        }

        // Check if the user already exists
        const existingUser = await User.findOne({ email: userData.email });
        if (existingUser) {
            return res.status(400).json({ message: 'User already exists' });
        }

        // Hash the password before saving (if using bcrypt)
        const passwordHash = await bcrypt.hash(user.password, 10); // Replace with hashPassword(userData.password) if using bcrypt

        // Create a new user in the database
        const newUser = new User({
            name: userData.name,
            email: userData.email,
            passwordHash: passwordHash, // Replace with hashPassword(userData.password) if using bcrypt
            role: userData.role,
            profilePicture: userData.profilePicture
        })

        await newUser.save();

        res.status(201).json({ message: 'User created successfully', user: newUser });
    } catch (error) {
        logger.error(`Error creating user: ${error.message}`);
        handleError(res, error);
    }
}


export const updateUser = async (req, res) => {
    try {
        const userId = req.params.id;
        const updateData = req.body;

        // Validate the user ID
        if (!isValidObjectId(userId)) {
            return res.status(400).json({ message: 'Invalid user ID' });
        }

        // Update the user in the database
        const updatedUser = await User.findByIdAndUpdate(userId, updateData, { new: true }).select('-passwordHash');

        if (!updatedUser) {
            return res.status(404).json({ message: 'User not found' });
        }

        res.status(200).json(updatedUser);
    } catch (error) {
        logger.error(`Error updating user: ${error.message}`);
        handleError(res, error);
    }
}


export const deleteUser = async (req, res) => {
    try {
        const userId = req.params.id;

        // Validate the user ID
        if (!isValidObjectId(userId)) {
            return res.status(400).json({ message: 'Invalid user ID' });
        }

        // Delete the user from the database
        const deletedUser = await User.findByIdAndDelete(userId);

        if (!deletedUser) {
            return res.status(404).json({ message: 'User not found' });
        }

        res.status(200).json({ message: 'User deleted successfully' });
    } catch (error) {
        logger.error(`Error deleting user: ${error.message}`);
        handleError(res, error);
    }
}