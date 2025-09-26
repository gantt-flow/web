import auth from './authMiddleware.js';
import authorize from './authorize.js';

/**
 * Middleware combinado que verifica autenticación y autorización
 * @param {...String} allowedRoles - Roles permitidos
 * @returns {Array} Array de middlewares
 */
const authWithRole = (...allowedRoles) => {
  return [auth, authorize(...allowedRoles)];
};

export default authWithRole;