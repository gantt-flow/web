import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';
import jwt from 'jsonwebtoken';
import User from '../models/user.js'; 
import { comparePassword } from '../utils/passwordUtils.js';
import crypto from 'crypto';
import { sendEmail, generatePasswordResetEmailHTML } from '../utils/email.js'; 


/**
 * @desc    Authenticates a user and returns a token in a cookie.
 * @route   POST /auth/login
 * @access  Public
 */
export const login = async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await User.findOne({ email });

        if (!user) {
            return res.status(400).json({ message: 'Invalid credentials.' });
        }

        const isMatch = await comparePassword(password, user.passwordHash);

        if (!isMatch) {
            return res.status(400).json({ message: 'Invalid credentials.' });
        }

        const payload = {
            user: {
                _id: user._id,
                email: user.email,
                name: user.name,
                role: user.role
            }
        };

     
        jwt.sign(
            payload,
            process.env.JWT_SECRET, 
            { expiresIn: '1h' },
            (err, token) => {
                if (err) throw err;

        
                res.cookie('token', token, {
                    httpOnly: true,
                    secure: process.env.NODE_ENV === 'production', 
                    sameSite: 'strict'
                });

                res.status(200).json({ 
                    msg: 'Login successful',
                    token: token, 
                    user: payload.user
                });
            }
        );

    } catch (err) {
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

    const { name, email, password, role } = req.body;

    try {
        
        const existingUser = await User.findOne({ email });

        if (existingUser) {
            return res.status(400).json({ message: 'User already exists' });
        }

        const newUser = new User({
            name,
            email,
            passwordHash: password, 
            role,
        });

       
        const salt = await bcrypt.genSalt(10);
    
        newUser.passwordHash = await bcrypt.hash(password, salt);

        await newUser.save();


        res.status(201).json({ message: 'User registered successfully' });
    } catch (err) {
    
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
       
        res.clearCookie('token');
    
        res.status(200).json({ message: 'Logout successful' });
    } catch (err) {
       
        console.error(err.message);
        res.status(500).json({ message: 'Server error' });
    }
};


// @route   POST /api/auth/change-password
// @desc    Permite a un usuario autenticado cambiar su propia contraseña
// @access  Privado
export const changePassword = async (req, res) => {
    const { currentPassword, newPassword } = req.body;
    const userId = req.user._id; 

    try {
       
        if (!currentPassword || !newPassword) {
            return res.status(400).json({ message: 'Todos los campos son requeridos.' });
        }

        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: 'Usuario no encontrado.' });
        }

        const isMatch = await bcrypt.compare(currentPassword, user.passwordHash);
        if (!isMatch) {
            return res.status(400).json({ message: 'La contraseña actual es incorrecta.' });
        }

        const salt = await bcrypt.genSalt(10);
        user.passwordHash = await bcrypt.hash(newPassword, salt);
        
        await user.save();

        res.status(200).json({ message: 'Contraseña actualizada exitosamente.' });

    } catch (err) {
        console.error(err.message);
        res.status(500).json({ message: 'Error de servidor' });
    }
};


export const forgotPassword = async (req, res) => {
    try {
        const { email } = req.body;
        const user = await User.findOne({ email });

        if (!user) {
            return res.status(200).json({ message: 'Si existe una cuenta con este correo, se ha enviado un enlace para restablecer la contraseña.' });
        }

        const resetToken = crypto.randomBytes(20).toString('hex');

        user.resetPasswordToken = crypto
            .createHash('sha256')
            .update(resetToken)
            .digest('hex');
        
        user.resetPasswordExpires = Date.now() + 3600000; // 1 hora en milisegundos

        await user.save();

        const resetUrl = `${process.env.FRONTEND_URL}/auth/restablecer-contrasena/${resetToken}`;

        const emailHtml = generatePasswordResetEmailHTML({ resetUrl });

        await sendEmail({
            to: user.email,
            subject: 'Restablecimiento de Contraseña - GanttFlow',
            html: emailHtml,
        });
        
        res.status(200).json({ message: 'Si existe una cuenta con este correo, se ha enviado un enlace para restablecer la contraseña.' });

    } catch (error) {
        console.error('Error en forgotPassword:', error);
        
        if (req.body.email) {
            const user = await User.findOne({ email: req.body.email });
            if (user) {
                user.resetPasswordToken = undefined;
                user.resetPasswordExpires = undefined;
                await user.save();
            }
        }
        res.status(500).json({ message: 'Error interno del servidor' });
    }
};

export const resetPassword = async (req, res) => {
    try {
      
        const hashedToken = crypto
            .createHash('sha256')
            .update(req.params.token)
            .digest('hex');

     
        const user = await User.findOne({
            resetPasswordToken: hashedToken,
            resetPasswordExpires: { $gt: Date.now() }, // $gt es "greater than" (mayor que)
        });

        if (!user) {
            return res.status(400).json({ message: 'El token es inválido o ha expirado. Por favor, solicita un nuevo enlace.' });
        }

        const salt = await bcrypt.genSalt(10);

        user.passwordHash = await bcrypt.hash(req.body.password, salt);
 
        user.resetPasswordToken = undefined;
        user.resetPasswordExpires = undefined;

        await user.save();

        try {
            await sendEmail({
                to: user.email,
                subject: 'Tu contraseña ha sido cambiada',
                title: 'Contraseña Actualizada Exitosamente',
                content: `Hola ${user.name},<br><br>Te confirmamos que la contraseña de tu cuenta en GanttFlow ha sido cambiada.<br><br>Si no realizaste este cambio, por favor contacta a nuestro soporte inmediatamente.`
            });
        } catch (emailError) {
            console.error("No se pudo enviar el email de confirmación, pero la contraseña fue cambiada:", emailError);
        }

        res.status(200).json({ message: 'Contraseña restablecida exitosamente.' });

    } catch (error) {
        console.error('Error en resetPassword:', error);
        res.status(500).json({ message: 'Error interno del servidor' });
    }
};