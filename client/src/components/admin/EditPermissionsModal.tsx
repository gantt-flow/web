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
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg p-6 w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold text-black">Editar Permisos de {user.name}</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 text-lg"
          >
            ×
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          {Object.entries(permissionGroups).map(([category, perms]) => (
            <div key={category} className="border rounded-lg p-4">
              <div className="flex justify-between items-center mb-3">
                <h3 className="font-semibold text-black">{category}</h3>
                <div>
                  <button
                    onClick={() => handleSelectAll(category, true)}
                    className="text-xs text-indigo-600 hover:text-indigo-800 mr-2"
                  >
                    Seleccionar todos
                  </button>
                  <button
                    onClick={() => handleSelectAll(category, false)}
                    className="text-xs text-red-600 hover:text-red-800"
                  >
                    Deseleccionar todos
                  </button>
                </div>
              </div>
              <div className="space-y-2">
                {perms.map(permission => (
                  <div key={permission.key} className="flex items-center">
                    <input
                      type="checkbox"
                      id={permission.key}
                      checked={permissionsMap.get(permission.key) || false}
                      onChange={(e) => handlePermissionChange(permission.key, e.target.checked)}
                      className="mr-3 h-4 w-4 text-indigo-600 rounded focus:ring-indigo-500"
                    />
                    <label htmlFor={permission.key} className="text-sm text-black">
                      {permission.label}
                    </label>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div className="flex justify-end gap-3 pt-4 border-t">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-md transition-colors"
          >
            Cancelar
          </button>
          <button
            type="button"
            onClick={handleSubmit}
            className="px-4 py-2 bg-indigo-600 text-white hover:bg-indigo-700 rounded-md transition-colors"
          >
            Guardar Cambios
          </button>
        </div>
      </div>
    </div>
  );
};

export default EditPermissionsModal;