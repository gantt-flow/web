import jwt from 'jsonwebtoken';

/**
 * Authentication middleware for Express.js.
 * This function checks for a valid JSON Web Token (JWT) in the request cookies
 * to protect routes that require a logged-in user.
 * * @param {object} req - The Express request object, containing request details.
 * @param {object} res - The Express response object, used to send a response.
 * @param {function} next - The callback function to pass control to the next middleware.
 */
const auth = (req, res, next) => {
    
    const token = req.cookies.token;

    
    if (!token) {
       
        return res.status(401).json({ msg: 'No token, authorization denied.' });
    }

   
    try {
    
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
 
        req.user = decoded.user;

        next();

    } catch (err) {
        
        res.status(401).json({ msg: 'Token is not valid.' });
    }
};

export default auth;