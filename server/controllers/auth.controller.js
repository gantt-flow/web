import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';
import jwt from 'jsonwebtoken';
import User from '../models/user.js'; 
import { comparePassword } from '../utils/passwordUtils.js';
import crypto from 'crypto';
import { sendEmail } from '../utils/email.js'; 


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
            return res.status(400).json({ message: 'Invalid credentials.' });
        }

        // Compare the provided password with the hashed password stored in the database.
        const isMatch = await comparePassword(password, user.passwordHash);

        // If the passwords do not match, send the same generic error message.
        if (!isMatch) {
            return res.status(400).json({ message: 'Invalid credentials.' });
        }

        // Create the payload for the JWT, containing non-sensitive user data.
        const payload = {
            user: {
                _id: user._id,
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


// @route   POST /api/auth/change-password
// @desc    Permite a un usuario autenticado cambiar su propia contraseña
// @access  Privado
export const changePassword = async (req, res) => {
    const { currentPassword, newPassword } = req.body;
    const userId = req.user._id; // Obtenido del middleware 'auth'

    try {
        // 1. Validar input
        if (!currentPassword || !newPassword) {
            return res.status(400).json({ message: 'Todos los campos son requeridos.' });
        }

        // 2. Obtener el usuario de la BD
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: 'Usuario no encontrado.' });
        }

        // 3. Verificar la contraseña actual
        const isMatch = await bcrypt.compare(currentPassword, user.passwordHash);
        if (!isMatch) {
            return res.status(400).json({ message: 'La contraseña actual es incorrecta.' });
        }

        // 4. Hashear y guardar la nueva contraseña
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
            // Por seguridad, no revelamos si el email existe o no.
            return res.status(200).json({ message: 'Si existe una cuenta con este correo, se ha enviado un enlace para restablecer la contraseña.' });
        }

        // 1. Generar un token aleatorio y seguro
        const resetToken = crypto.randomBytes(20).toString('hex');

        // 2. Hashear el token y guardarlo en la base de datos
        // (Hashear es opcional pero una buena práctica de seguridad)
        user.resetPasswordToken = crypto
            .createHash('sha256')
            .update(resetToken)
            .digest('hex');
        
        // 3. Establecer una expiración de 1 hora
        user.resetPasswordExpires = Date.now() + 3600000; // 1 hora en milisegundos

        await user.save();

        // 4. Crear la URL de restablecimiento
        const resetUrl = `${process.env.FRONTEND_URL}/auth/restablecer-contrasena/${resetToken}`;

        // 5. Enviar el email
        const message = `
            Has solicitado restablecer tu contraseña. Por favor, haz clic en el siguiente enlace para continuar. El enlace es válido por 1 hora.\n\n
            ${resetUrl}\n\n
            Si no solicitaste esto, por favor ignora este correo.
        `;

        await sendEmail({
            to: user.email,
            subject: 'Restablecimiento de Contraseña - GanttFlow',
            text: message,
        });
        
        res.status(200).json({ message: 'Si existe una cuenta con este correo, se ha enviado un enlace para restablecer la contraseña.' });

    } catch (error) {
        console.error('Error en forgotPassword:', error);
        // Limpiamos el token si algo falla para que el usuario pueda intentarlo de nuevo
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
        // 1. Hashear el token que viene del parámetro de la URL
        const hashedToken = crypto
            .createHash('sha256')
            .update(req.params.token)
            .digest('hex');

        // 2. Buscar al usuario por el token hasheado y que no haya expirado
        const user = await User.findOne({
            resetPasswordToken: hashedToken,
            resetPasswordExpires: { $gt: Date.now() }, // $gt es "greater than" (mayor que)
        });

        if (!user) {
            return res.status(400).json({ message: 'El token es inválido o ha expirado. Por favor, solicita un nuevo enlace.' });
        }

        // Generamos un 'salt' para la encriptación
        const salt = await bcrypt.genSalt(10);
        // Encriptamos (hasheamos) la nueva contraseña explícitamente
        user.passwordHash = await bcrypt.hash(req.body.password, salt);
        // Limpiar los campos del token para que no se pueda volver a usar
        user.resetPasswordToken = undefined;
        user.resetPasswordExpires = undefined;

        // El 'pre-save hook' en tu modelo de User se encargará de hashear la nueva contraseña
        await user.save();

        // 4. Opcional: Enviar un email de confirmación
        try {
            await sendEmail({
                to: user.email,
                subject: 'Tu contraseña ha sido cambiada',
                text: `Hola ${user.name},\n\nTe confirmamos que la contraseña de tu cuenta ha sido cambiada exitosamente.\n\nSi no realizaste este cambio, por favor contacta a nuestro soporte inmediatamente.`
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