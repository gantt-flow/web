import bcrypt from 'bcryptjs';

/**
 * Hash a plain text password.
 * @param {string} password - The plain text password.
 * @param {number} saltRounds - Number of salt rounds (default: 10).
 * @returns {Promise<string>} - The hashed password.
 */
export const hashPassword = async (password, saltRounds = 10) => {
    if (!password) throw new Error('Password is required for hashing');
    return await bcrypt.hash(password, saltRounds);
};

/**
 * Compare a plain text password with a hash.
 * @param {string} password - The plain text password.
 * @param {string} hash - The hashed password.
 * @returns {Promise<boolean>} - True if match, false otherwise.
 */
export const comparePassword = async (password, hash) => {
    if (!password || !hash) throw new Error('Password and hash are required for comparison');
    return bcrypt.compare(password, hash);
};

/**
 * Validate password strength (basic example).
 * @param {string} password
 * @returns {boolean} - True if password is strong enough.
 */
export const isPasswordStrong = (password) => {
    // At least 8 chars, one uppercase, one lowercase, one number
    const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;
    return regex.test(password);
};