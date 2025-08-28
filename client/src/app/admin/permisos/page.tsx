// app/admin/permisos/page.tsx
'use client';
import { useState, useEffect } from 'react';
import { DataTable } from '@/components/ui/DataTable';
import EditPermissionsModal from '@/components/admin/EditPermissionsModal';
import { User, getAllUsers, updateUser } from '@/services/userService';

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

// Ajusta aquí cuáles son los dos permisos que deben venir activos por defecto
const DEFAULT_ACTIVE_PERMISSIONS = ['canViewProject', 'canViewTask'];

/** Normaliza cualquier permisión a un array de strings */
const normalizePermissions = (perms?: any): string[] => {
  if (Array.isArray(perms)) {
    return perms;
  }
  
  if (perms instanceof Map) {
    const activePermissions: string[] = [];
    perms.forEach((value, key) => {
      if (value) activePermissions.push(key);
    });
    return activePermissions;
  }
  
  if (typeof perms === 'object' && perms !== null) {
    return Object.entries(perms)
      .filter(([_, value]) => value)
      .map(([key, _]) => key);
  }
  
  return DEFAULT_ACTIVE_PERMISSIONS;
};

export default function PermissionsAdminPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [editingUser, setEditingUser] = useState<User | null>(null);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const data = await getAllUsers();
        // Normalizamos permisos para la UI: siempre como array de strings
        const normalizedUsers = data.map((u: User) => ({
          ...u,
          permisions: normalizePermissions(u.permisions)
        }));
        setUsers(normalizedUsers);
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
      // Enviamos directamente el array de strings (formato frontend)
      // El backend debe manejar la conversión a su formato interno
      await updateUser(updatedUser._id, { 
        permisions: updatedUser.permisions 
      });
      
      // Actualizar la lista de usuarios localmente
      setUsers(prev => prev.map(u => 
        u._id === updatedUser._id ? updatedUser : u
      ));
      
      setEditingUser(null);
    } catch (error) {
      console.error('Error al actualizar permisos:', error);
    }
  };

  // Función para mostrar los permisos en la tabla
  const renderPermissions = (perms?: any) => {
    const normalized = normalizePermissions(perms);
    
    if (normalized.length === 0) {
      return <span className="text-gray-500 italic">Sin permisos activos</span>;
    }

    return (
      <div className="flex flex-col gap-1">
        {normalized.map(permKey => {
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
      render: (value?: any) => renderPermissions(value)
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
      <div className="flex-1 p-8 bg-gray-50">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-800">Gestión de Permisos de Usuarios</h1>
          <p className="text-gray-600">Administra los permisos de acceso para cada usuario del sistema</p>
        </div>
        <div className="bg-white rounded-lg shadow overflow-hidden">
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