import { logger } from './logger.js';

/**
 * Handles errors and sends a standardized response.
 * @param {object} res - Express response object
 * @param {Error} error - Error object
 * @param {number} [status=500] - Optional HTTP status code
 */
export const handleError = (res, error, status = 500) => {
    logger.error(error.message, error.stack);
    res.status(status).json({
        message: error.message || 'Internal server error',
        error: process.env.NODE_ENV === 'development' ? error.stack : undefined,
    });
};