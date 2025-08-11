// src/middleware/authMiddleware.js

import jwt from 'jsonwebtoken';

const auth = (req, res, next) => {
    // Obtener el token de la cookie
    const token = req.cookies.token;

    // Verificar si el token existe
    if (!token) {
        return res.status(401).json({ msg: 'No hay token, autorización denegada.' });
    }

    try {
        // Verificar el token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        
        // Agregar el usuario del payload al objeto de la petición
        // para que pueda ser accedido en las rutas protegidas
        req.user = decoded.user;
        
        // Continuar con la siguiente función de middleware o ruta
        next();
    } catch (err) {
        // Si el token no es válido, enviar un error
        res.status(401).json({ msg: 'El token no es válido.' });
    }
};

export default auth;