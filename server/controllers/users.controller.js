import User from '../models/user.js';
import { isValidObjectId } from 'mongoose'; // Import Mongoose's isValidObjectId for ID validation
import { logger } from '../utils/logger.js';
import { generateAuditLog } from '../utils/auditService.js';
import { hashPassword } from '../utils/passwordUtils.js';


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
    // Destructure query parameters from the request URL (e.g., /api/users?page=2&role=admin).
    // Set default values for pagination: page 1 and a limit of 10 items per page.
    // 'role' will be undefined if not provided in the URL.
    const { page = 1, limit = 10, role } = req.query;

    // Create a filter object for the database query.
    // This is a conditional (ternary) operator. If a 'role' was provided in the query,
    // the filter will be { role: role }. Otherwise, it's an empty object {},
    // which tells Mongoose to match all documents.
    const filter = role ? { role } : {};

    // Execute the database query using the 'User' Mongoose model.
    // 'await' pauses the function until the database returns the results.
    const users = await User
      .find(filter) // 1. Find all user documents that match the filter object.

      // 2. Select specific fields to return, excluding sensitive data like passwords.
      // This is also known as a "projection".
      .select('name email role isActive createdAt updatedAt')

      // 3. Skip a number of documents for pagination.
      // Example: For page 2 with a limit of 10, it skips (2-1)*10 = 10 documents.
      .skip((page - 1) * limit)

      // 4. Limit the number of documents returned in this batch to the specified 'limit'.
      // We ensure 'limit' is a number, as query parameters are strings.
      .limit(Number(limit));

    // If the query is successful, send a 200 OK status code along with the
    // array of user objects in JSON format as the response.
    res.status(200).json(users);

  } catch (error) {
    logger.error(`Error fetching users: ${error.message}`);
    // Call a centralized error handling function to send a standardized
    // error response (e.g., a 500 Internal Server Error) to the client.
    handleError(res, error);
  }
};

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

        // Hash the password before saving
        const passwordHash = hashPassword(userData.password);

        // Create a new user in the database
        const newUser = new User({
            name: userData.name,
            email: userData.email,
            passwordHash: passwordHash, // Store the hashed password, not the original.
            role: userData.role
        })

        // Save the new user to the database
        await newUser.save();
        // Record this important event in an audit log for security and tracking.
        await generateAuditLog(req, 'CREATE', 'User', newUser._id, `Usuario creado: ${newUser.email}`);

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

        await generateAuditLog(req, 'UPDATE', 'User', userId, `Usuario actualizado: Campos modificados: ${Object.keys(updateData).join(', ')}`);

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

        await generateAuditLog(req, 'DELETE', 'User', userId, `Usuario eliminado: ${deletedUser.email}`);

        res.status(200).json({ message: 'User deleted successfully' });
    } catch (error) {
        logger.error(`Error deleting user: ${error.message}`);
        handleError(res, error);
    }
}