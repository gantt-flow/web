/**
 * Middleware de autorización por roles
 * @param {...String} allowedRoles - Roles permitidos para la ruta
 * @returns {Function} Middleware function
 */
const authorize = (...allowedRoles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ message: 'No autorizado: usuario no autenticado' });
    }

    // Verificar si el usuario tiene uno de los roles permitidos
    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({ 
        message: 'Acceso denegado: no tienes permisos suficientes',
        requiredRoles: allowedRoles,
        userRole: req.user.role
      });
    }

    next();
  };
};

export default authorize;