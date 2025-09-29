import User from '../models/user.js';
import { isValidObjectId } from 'mongoose';
import { logger } from '../utils/logger.js';
import { handleError } from '../utils/errorHandler.js';
import { generateAuditLog } from '../utils/auditService.js';
import { hashPassword } from '../utils/passwordUtils.js';
import jwt from 'jsonwebtoken';

export const getCurrentUser = async (req, res) => {
    try {
        res.status(200).json({
            authenticated: true,
            user: req.user 
        });
    } catch (error) {
        logger.error(`Error fetching user: ${error.message}`);
        handleError(res, error);
    }
}

export const getUserWithId = async (req, res) => {
    try {
        const userId = req.params.id;

        
        if (!isValidObjectId(userId)) {
            return res.status(400).json({ message: 'Invalid user ID' });
        }

        
        const user = await User.findById(userId).select('-passwordHash'); 
        
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

   
        if (!userData.name || !userData.email || !userData.password || !userData.role) {
            return res.status(400).json({ message: 'Fill all the required fields' });
        }

     
        const existingUser = await User.findOne({ email: userData.email });
        if (existingUser) {
            return res.status(400).json({ message: 'User already exists' });
        }

    
        const passwordHash = hashPassword(userData.password);

      
        const newUser = new User({
            name: userData.name,
            email: userData.email,
            passwordHash: passwordHash, 
            role: userData.role
        })

    
        await newUser.save();
      
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

    
        const updatedUser = await User.findByIdAndUpdate(userId, updateData, { new: true }).select('-passwordHash');

        if (!updatedUser) {
            return res.status(404).json({ message: 'User not found' });
        }

       
        await generateAuditLog(req, 'UPDATE', 'User', userId, `Usuario actualizado: Campos modificados: ${Object.keys(updateData).join(', ')}`);

        
        const isEditingOwnProfile = req.user._id.toString() === userId.toString();
        
        if (isEditingOwnProfile) {
          
            const payload = {
                user: {
                    _id: req.user._id,   
                    email: req.user.email,   
                    name: updateData.name || req.user.name,
                    role: req.user.role       
                }
            };

            
            const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '3h' });

            
            res.cookie('token', token, {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                sameSite: 'strict'
            });
        }

       
        res.status(200).json({
            user: updatedUser,
            tokenRegenerated: isEditingOwnProfile 
        });

    } catch (error) {
        logger.error(`Error updating user: ${error.message}`);
        res.status(500).json({ message: 'Server error' });
    }
};


export const deleteUser = async (req, res) => {
    try {
        const userId = req.params.id;

    
        if (!isValidObjectId(userId)) {
            return res.status(400).json({ message: 'Invalid user ID' });
        }

      
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
