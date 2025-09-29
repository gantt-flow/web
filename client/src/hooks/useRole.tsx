import { useAuth } from '@/contexts/AuthContext';

export const useRole = () => {
  const { user } = useAuth();

  const hasRole = (allowedRoles: string[]): boolean => {
    if (!user) return false;
    return allowedRoles.includes(user.role);
  };

  const isAdmin = () => hasRole(['Administrador de sistema']);
  const isAuditor = () => hasRole(['Auditor']);
  const canAccess = (path: string) => {
    const routePermissions: { [key: string]: string[] } = {
      '/admin/sistema/usuarios': ['Administrador de sistema'],
      '/admin/proyectos/permisos': ['Administrador de sistema','Administrador de proyectos'],
      '/admin/sistema/auditoria': ['Administrador de sistema', 'Auditor'],
    };

    const allowedRoles = routePermissions[path];
    return allowedRoles ? hasRole(allowedRoles) : true;
  };

  return {
    hasRole,
    isAdmin,
    isAuditor,
    canAccess,
    userRole: user?.role,
    user
  };
};