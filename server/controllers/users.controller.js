import User from '../models/user.js';
import { isValidObjectId } from 'mongoose'; // Import Mongoose's isValidObjectId for ID validation
import { logger } from '../utils/logger.js';
import { handleError } from '../utils/errorHandler.js';
import { generateAuditLog } from '../utils/auditService.js';
import { hashPassword } from '../utils/passwordUtils.js';
import jwt from 'jsonwebtoken';

export const getCurrentUser = async (req, res) => {
    try {
        res.status(200).json({
            authenticated: true,
            user: req.user // req.user is set in the auth middleware and sends only non-sensitive user data
        });
    } catch (error) {
        logger.error(`Error fetching user: ${error.message}`);
        handleError(res, error);
    }
}

export const getUserWithId = async (req, res) => {
    try {
        const userId = req.params._id;

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

        res.status(201).json({ message: 'User created successfully'});
    } catch (error) {
        logger.error(`Error creating user: ${error.message}`);
        handleError(res, error);
    }
}


export const updateUser = async (req, res) => {
    try {
        const userId = req.params.id;
        const updateData = req.body;


        delete updateData.passwordHash;

        if (!isValidObjectId(userId)) {
            return res.status(400).json({ message: 'Invalid user ID' });
        }

        // 1. Actualizar al usuario en la BD
        const updatedUser = await User.findByIdAndUpdate(userId, updateData, { new: true }).select('-passwordHash');

        if (!updatedUser) {
            return res.status(404).json({ message: 'User not found' });
        }

        // 2. Generar el log de auditoría
        await generateAuditLog(req, 'UPDATE', 'User', userId, `Usuario actualizado: Campos modificados: ${Object.keys(updateData).join(', ')}`);

        // 3. Solo regenerar el token si el usuario editado es el mismo que está logueado
        const isEditingOwnProfile = req.user._id.toString() === userId.toString();
        
        if (isEditingOwnProfile) {
            // Solo regenerar token si el usuario está editando su propio perfil
            const payload = {
                user: {
                    _id: req.user._id,   
                    email: req.user.email,   
                    name: updateData.name || req.user.name,
                    role: req.user.role       
                }
            };

            // 4. Establecer nueva cookie SOLO si es el propio usuario
            const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '3h' });

            // 5. Volver a establecer la cookie httpOnly con el token actualizado
            res.cookie('token', token, {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                sameSite: 'strict'
            });
        }

        // 6. Enviar la respuesta 
        res.status(200).json({
            user: updatedUser,
            tokenRegenerated: isEditingOwnProfile // Informar si se regeneró el token
        });

    } catch (error) {
        logger.error(`Error updating user: ${error.message}`);
        res.status(500).json({ message: 'Server error' });
    }
};


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
