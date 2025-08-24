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
    // Attempt to retrieve the JWT from the request's cookies.
    const token = req.cookies.token;

    // If no token is found in the cookies, the user is not authenticated.
    if (!token) {
        // Stop the request and send a 401 "Unauthorized" status with an error message.
        return res.status(401).json({ msg: 'No token, authorization denied.' });
    }

    // Handle potential errors during token verification, such as an expired or malformed token.
    try {
        // Verify the token's authenticity using the secret key stored in environment variables.
        // `jwt.verify()` decodes the token. If it's invalid or expired, it will throw an error.
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
 
        // If the token is valid, the 'decoded' payload (set in auth.controller.js during login)
        // is attached to the Express request object (req).
        // This makes the user's data (e.g., ID, role) available to any subsequent
        // protected route handlers.
        req.user = decoded.user;

        // Call `next()` to pass control to the next function in the middleware stack,
        // which will ultimately be the intended route handler (e.g., getUserProfile).
        next();

    } catch (err) {
        // If `jwt.verify()` throws an error, it means the token is not valid.
        // Send a 401 "Unauthorized" status with an error message.
        res.status(401).json({ msg: 'Token is not valid.' });
    }
};

export default auth;