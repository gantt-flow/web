import crypto from 'crypto';

/**
 * Generate a random token string.
 * @param {number} length - Number of bytes for the token (default: 32).
 * @returns {string} - Hexadecimal token string.
 */

export const generateToken = (length = 32) => {
    return crypto.randomBytes(length).toString('hex');
};

/**
 * Generate a token with an expiration timestamp.
 * @param {number} length - Number of bytes for the token (default: 32).
 * @param {number} expiresIn - Expiration time in milliseconds (default: 1 hour).
 * @returns {{ token: string, expiresAt: number }}
 */


export const generateExpiringToken = (length = 32, expiresIn = 1000 * 60 * 60) => {
    const token = generateToken(length);
    const expiresAt = Date.now() + expiresIn;
    return { token, expiresAt };
};


/**
 * Validate if a token is expired.
 * @param {number} expiresAt - Expiration timestamp.
 * @returns {boolean} - True if expired, false otherwise.
 */


export const isTokenExpired = (expiresAt) => {
    return Date.now() > expiresAt;
};