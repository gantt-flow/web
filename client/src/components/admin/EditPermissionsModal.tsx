// components/admin/EditPermissionsModal.tsx
'use client';
import { useState, useEffect } from 'react';
import { User, normalizePermissionsToMap } from '@/services/userService';

// Definir los permisos disponibles según el modelo
const PERMISSIONS_LIST = [
  { key: 'canCreateProject', label: 'Crear Proyectos', category: 'Proyectos' },
  { key: 'canEditProject', label: 'Editar Proyectos', category: 'Proyectos' },
  { key: 'canDeleteProject', label: 'Eliminar Proyectos', category: 'Proyectos' },
  { key: 'canViewProject', label: 'Ver Proyectos', category: 'Proyectos' },
  { key: 'canCreateTask', label: 'Crear Tareas', category: 'Tareas' },
  { key: 'canEditTask', label: 'Editar Tareas', category: 'Tareas' },
  { key: 'canDeleteTask', label: 'Eliminar Tareas', category: 'Tareas' },
  { key: 'canViewTask', label: 'Ver Tareas', category: 'Tareas' },
];

// Agrupar permisos por categoría
const groupPermissionsByCategory = () => {
  return PERMISSIONS_LIST.reduce((groups, permission) => {
    const category = permission.category;
    if (!groups[category]) {
      groups[category] = [];
    }
    groups[category].push(permission);
    return groups;
  }, {} as Record<string, typeof PERMISSIONS_LIST>);
};

interface EditPermissionsModalProps {
  user: User;
  onClose: () => void;
  onSave: (user: User) => void;
}

const EditPermissionsModal = ({ user, onClose, onSave }: EditPermissionsModalProps) => {
  const [permissionsMap, setPermissionsMap] = useState<Map<string, boolean>>(new Map());
  const permissionGroups = groupPermissionsByCategory();

  useEffect(() => {
    // Normalizar permisos a Map
    const normalizedPermissions = normalizePermissionsToMap(user.permisions);
    setPermissionsMap(normalizedPermissions);
  }, [user]);

  const handlePermissionChange = (key: string, value: boolean) => {
    setPermissionsMap(prev => {
      const newMap = new Map(prev);
      newMap.set(key, value);
      return newMap;
    });
  };

  const handleSubmit = () => {
    const updatedUser = {
      ...user,
      permisions: new Map(permissionsMap)
    };
    
    onSave(updatedUser);
  };

  const handleSelectAll = (category: string, value: boolean) => {
    const categoryPermissions = PERMISSIONS_LIST.filter(p => p.category === category);
    
    setPermissionsMap(prev => {
      const newMap = new Map(prev);
      categoryPermissions.forEach(p => {
        newMap.set(p.key, value);
      });
      return newMap;
    });
  };

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 transition-opacity duration-300 p-4">
      <div className="bg-gray-50 p-8 rounded-xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-6 pb-4 border-b border-gray-200">
          <h2 className="text-2xl font-bold text-gray-800">Editar Permisos de {user.name}</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 text-xl font-bold"
          >
            ×
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          {Object.entries(permissionGroups).map(([category, perms]) => (
            <div key={category} className="border border-gray-300 rounded-lg p-4 bg-white shadow-sm">
              <div className="flex justify-between items-center mb-3">
                <h3 className="font-semibold text-gray-700">{category}</h3>
                <div>
                  <button
                    onClick={() => handleSelectAll(category, true)}
                    className="text-xs text-indigo-600 hover:text-indigo-800 mr-2 font-medium"
                  >
                    Seleccionar todos
                  </button>
                  <button
                    onClick={() => handleSelectAll(category, false)}
                    className="text-xs text-red-600 hover:text-red-800 font-medium"
                  >
                    Deseleccionar todos
                  </button>
                </div>
              </div>
              <div className="space-y-3">
                {perms.map(permission => (
                  <div key={permission.key} className="flex items-center">
                    <input
                      type="checkbox"
                      id={permission.key}
                      checked={permissionsMap.get(permission.key) || false}
                      onChange={(e) => handlePermissionChange(permission.key, e.target.checked)}
                      className="mr-3 h-4 w-4 text-indigo-600 rounded focus:ring-indigo-500 border-gray-300"
                    />
                    <label htmlFor={permission.key} className="text-sm text-gray-700">
                      {permission.label}
                    </label>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div className="flex justify-end gap-4 pt-6 border-t border-gray-200">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-md border bg-white text-gray-700 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
          >
            Cancelar
          </button>
          <button
            type="button"
            onClick={handleSubmit}
            className="px-6 py-2 rounded-md bg-indigo-600 text-white font-semibold hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            Guardar Cambios
          </button>
        </div>
      </div>
    </div>
  );
};

export default EditPermissionsModal;