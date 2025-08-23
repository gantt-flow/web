import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/user.js'; 


// @route   POST /api/auth/login
// @desc    Autentica un usuario y devuelve un token en una cookie
// @access  Publico
export const login = async (req, res) => {

    const { email, password } = req.body;

    try {
        const user = await User.findOne({ email });

        if (!user) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        const isMatch = await bcrypt.compare(password, user.passwordHash);

        if (!isMatch) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        const payload = {
            user: {
                id: user.id,
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
                    msg: 'Inicio de sesión exitoso',
                    user: payload.user 
                });
            }
        );

    } catch (err) {
        console.error(err.message);
        res.status(500).json({ message: 'Server error' });
    }
};


export const signUp = async (req, res) => {

    const { name, email, password, role} = req.body;

    try {
        const existingUser = await User.findOne({email});

        if(existingUser){
            return res.status(400).json({ message: 'User already exists'});
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

// @route   POST /api/auth/logout
// @desc    Cierra la sesión del usuario limpiando la cookie
// @access  Privado (requiere que el usuario esté logueado)
export const logout = async (req, res) => {
    try {
        // La forma más limpia de borrar una cookie es con clearCookie.
        // Esto le envía al navegador una instrucción para eliminar la cookie 'token'.
        res.clearCookie('token');
        res.status(200).json({ message: 'Logout exitoso' });
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ message: 'Error en el servidor' });
    }
};