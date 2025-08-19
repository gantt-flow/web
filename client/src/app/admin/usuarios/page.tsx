// app/admin/usuarios/page.tsx
'use client';
import { useState, useEffect } from 'react';
import { DataTable } from '@/components/ui/DataTable';
import EditUserModal from '@/components/admin/EditUserModal';
import CreateUserModal from '@/components/admin/CreateUserModal';
import { User, getAllUsers, deleteUser, updateUser, createUserAdmin } from '@/services/userService';

interface NewUser {
  name: string;
  email: string;
  password: string;
  role: string;
  isActive: boolean;
  profilePicture?: string;
  notifications?: boolean;
  theme?: string;
  readOnly?: boolean;
  auditLogAccess?: boolean;
}

export default function DashboardLayoutAdmin() {
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false); // Estado para controlar el modal de creación

  // Fetch users al cargar el componente
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

  // Handler para eliminar usuario
  const handleDelete = async (userId: string) => {
    if (confirm('¿Estás seguro de eliminar este usuario?')) {
      await deleteUser(userId);
      setUsers(users.filter((user) => user._id !== userId));
    }
  };

  // Handler para guardar cambios en usuario
  const handleSaveUser = async (updatedUser: User) => {
    try {
      // Llama a tu servicio de actualización
      const result = await updateUser(updatedUser._id, updatedUser);
      
      // Actualiza la lista de usuarios
      setUsers(users.map(user => 
        user._id === updatedUser._id ? updatedUser : user
      ));
    } catch (error) {
      console.error('Error al actualizar usuario:', error);
    }
  };
  // Handler para crear un nuevo usuario
  const handleCreateUser = async (newUserData: Partial<User>) => {
  try {
    // Verifica campos obligatorios
    if (!newUserData.name || !newUserData.email || !newUserData.password) {
      throw new Error('Nombre, email y contraseña son campos requeridos');
    }
    
    // Crea un objeto que cumpla con la interfaz NewUser
    const userToCreate = {
      name: newUserData.name,
      email: newUserData.email,
      password: newUserData.password,
      role: newUserData.role || 'Miembro de equipo', // Valor por defecto
      isActive: newUserData.isActive !== undefined ? newUserData.isActive : true,
      profilePicture: newUserData.profilePicture || 'default-profile.png',
      notifications: newUserData.notifications !== undefined ? newUserData.notifications : true,
      theme: newUserData.theme || 'system',
      readOnly: newUserData.readOnly || false,
      auditLogAccess: newUserData.auditLogAccess || false
    };
    
    // Usa aserción de tipo para cumplir con NewUser
    const newUser = await createUserAdmin(userToCreate as NewUser);
    
    setUsers([...users, newUser]);
    setIsCreateModalOpen(false);
  } catch (error) {
    console.error('Error al crear usuario:', error);
    alert(error);
  }
};

  // Columnas de la tabla
  const userColumns = [
  { key: 'name', header: 'Nombre', width: 'w-1/4' },
  { key: 'email', header: 'Email', width: 'w-1/4' },
  { key: 'role', header: 'Rol', width: 'w-1/4' },
  { 
    key: 'isActive', 
    header: 'Estado', 
    width: 'w-1/4',
    // Añade la función render aquí
    render: (value: any) => {
      // Convierte cualquier valor a booleano
      const isActive = value === true || value === 'true' || value === 1;
      
      return (
        <span className={`px-2 py-1 rounded-full text-xs ${
          isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
        }`}>
          {isActive ? 'Activo' : 'Inactivo'}
        </span>
      );
    }
  },
];

  return (
    <div className="flex flex-row min-h-screen">
      {/* Contenido principal */}
      <div className="flex-1 p-8 bg-gray-50">
        <div className="mb-6 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-800">Gestión de Usuarios</h1>
          <button 
            onClick={() => setIsCreateModalOpen(true)} // Abrir modal de creación
            className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700"
          >
            + Nuevo Usuario
          </button>
        </div>

        {/* DataTable */}
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <DataTable
            columns={userColumns}
            data={users}
            onEdit={(id) => {
              const userToEdit = users.find(user => user._id === id);
              if (userToEdit) setEditingUser(userToEdit);
            }}
            onDelete={handleDelete}
            isLoading={isLoading}
          />
        </div>

        {/* Modal de edición */}
        {editingUser && (
          <EditUserModal
            user={editingUser}
            onClose={() => setEditingUser(null)}
            onSave={handleSaveUser}
          />
        )}
        {/*Modal de creación*/}
      {isCreateModalOpen && (
        <CreateUserModal
          onClose={() => setIsCreateModalOpen(false)}
          onCreate={handleCreateUser}
        />
      )}
      </div>
    </div>
  );
}