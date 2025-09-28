// app/admin/permisos/page.tsx
'use client';
import { useState, useEffect } from 'react';
import { DataTable } from '@/components/ui/DataTable';
import EditPermissionsModal from '@/components/admin/EditPermissionsModal';
import { User, updateUser, normalizePermissionsToArray } from '@/services/userService';
import {getAllUsers} from '@/services/adminService';

// Definir los permisos disponibles según el modelo
const PERMISSIONS_LIST = [
  { key: 'canCreateProject', label: 'Crear Proyectos' },
  { key: 'canEditProject', label: 'Editar Proyectos' },
  { key: 'canDeleteProject', label: 'Eliminar Proyectos' },
  { key: 'canViewProject', label: 'Ver Proyectos' },
  { key: 'canCreateTask', label: 'Crear Tareas' },
  { key: 'canEditTask', label: 'Editar Tareas' },
  { key: 'canDeleteTask', label: 'Eliminar Tareas' },
  { key: 'canViewTask', label: 'Ver Tareas' },
];

export default function PermissionsAdminPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [editingUser, setEditingUser] = useState<User | null>(null);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const data = await getAllUsers();
        setUsers(data);
      } catch (error) {
        console.error('Error fetching users:', error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchUsers();
  }, []);

  const handleSavePermissions = async (updatedUser: User) => {
    try {
      await updateUser(updatedUser._id, { permisions: updatedUser.permisions });
      
      // Actualizar la lista de usuarios
      setUsers(prev => prev.map(u => 
        u._id === updatedUser._id ? updatedUser : u
      ));
      
      setEditingUser(null);
    } catch (error) {
      console.error('Error al actualizar permisos:', error);
    }
  };

  // Función para mostrar los permisos en la tabla
  const renderPermissions = (perms: any) => {
    // Normalizar permisos a array de strings para visualización
    const activePermissions = normalizePermissionsToArray(perms);
    
    if (activePermissions.length === 0) {
      return <span className="text-gray-500 italic">Sin permisos activos</span>;
    }

    return (
      <div className="flex flex-col gap-1">
        {activePermissions.map(permKey => {
          const permission = PERMISSIONS_LIST.find(p => p.key === permKey);
          return (
            <span 
              key={permKey} 
              className="bg-indigo-100 text-indigo-800 text-xs font-medium px-2 py-1 rounded-full inline-flex items-center justify-center"
            >
              {permission ? permission.label : permKey}
            </span>
          );
        })}
      </div>
    );
  };

  const columns = [
    { key: 'name', header: 'Nombre', width: 'w-1/5' },
    { key: 'email', header: 'Email', width: 'w-1/5' },
    { key: 'role', header: 'Rol', width: 'w-1/5' },
    { 
      key: 'permisions', 
      header: 'Permisos', 
      width: 'w-2/5',
      render: (value: any) => renderPermissions(value)
    },
    {
      key: 'actions',
      header: 'Acciones',
      width: 'w-1/5',
      render: (_: any, user: User) => (
        <button 
          onClick={() => setEditingUser(user)} 
          className="text-indigo-600 hover:text-indigo-900 px-3 py-1 bg-indigo-50 rounded-md text-sm"
        >
          Editar
        </button>
      ),
    },
  ];

  return (
    <div className="flex flex-row min-h-screen">
      <div className="flex-1 p-8 bg-gray-50 dark:bg-gray-900">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-800 dark:text-gray-200">Gestión de Permisos de Usuarios</h1>
          <p className="text-gray-600 dark:text-gray-400">Administra los permisos de acceso para cada usuario del sistema</p>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden border border-gray-200 dark:border-gray-700">
          <DataTable columns={columns} data={users} isLoading={isLoading} />
        </div>
        
        {/* Modal de edición de permisos */}
        {editingUser && (
          <EditPermissionsModal
            user={editingUser}
            onClose={() => setEditingUser(null)}
            onSave={handleSavePermissions}
          />
        )}
      </div>
    </div>
  );
}