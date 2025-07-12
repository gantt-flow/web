import { generateExpiringToken, isTokenExpired } from './token.js';

/**
 * Generate a password reset token with expiration.
 * @param {number} length - Number of bytes for the token (default: 20).
 * @param {number} expiresIn - Expiration time in milliseconds (default: 1 hour).
 * @returns {{ token: string, expiresAt: number }}
 */
export const generatePasswordResetToken = (length = 20, expiresIn = 1000 * 60 * 60) => {
    return generateExpiringToken(length, expiresIn);
};

/**
 * Validate a password reset token's expiration.
 * @param {number} expiresAt - Expiration timestamp.
 * @returns {boolean} - True if expired, false otherwise.
 */
export const isPasswordResetTokenExpired = (expiresAt) => {
    return isTokenExpired(expiresAt);
};