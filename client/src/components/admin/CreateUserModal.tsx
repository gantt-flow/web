// components/admin/CreateUserModal.tsx
'use client';
import { useState } from 'react';
import { User } from '@/services/userService';

interface CreateUserModalProps {
  onClose: () => void;
  onCreate: (newUser: Partial<User>) => void; // Cambia el tipo aquí
}

const CreateUserModal = ({ onClose, onCreate }: CreateUserModalProps) => {
  // Estado con todas las propiedades necesarias
  const [formData, setFormData] = useState<Partial<User>>({
    name: '',
    email: '',
    password: '', // Campo para la contraseña
    role: 'Miembro de equipo',
    isActive: true,
    profilePicture: 'default-profile.png',
    notifications: true,
    theme: 'system',
    readOnly: false,
    auditLogAccess: false
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    
    setFormData(prev => ({
      ...prev,
      [name]: name === 'isActive' || name === 'notifications' 
        ? (value === 'true') 
        : value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.password) {
      alert('Por favor complete todos los campos requeridos');
      return;
    }
    
    onCreate(formData);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md">
        <h2 className="text-xl font-bold mb-4 text-black">Crear Nuevo Usuario</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-sm font-medium mb-1 text-black">Nombre*</label>
            <input
              type="text"
              name="name"
              value={formData.name || ''}
              onChange={handleChange}
              className="w-full p-2 border rounded text-black"
              required
            />
          </div>
          
          <div className="mb-4">
            <label className="block text-sm font-medium mb-1 text-black">Email*</label>
            <input
              type="email"
              name="email"
              value={formData.email || ''}
              onChange={handleChange}
              className="w-full p-2 border rounded text-black"
              required
            />
          </div>
          
          <div className="mb-4">
            <label className="block text-sm font-medium mb-1 text-black">Contraseña*</label>
            <input
              type="password"
              name="password"
              value={formData.password || ''}
              onChange={handleChange}
              className="w-full p-2 border rounded text-black"
              required
            />
          </div>
          
          <div className="mb-4">
            <label className="block text-sm font-medium mb-1 text-black">Rol*</label>
            <select
              name="role"
              value={formData.role || ''}
              onChange={handleChange}
              className="w-full p-2 border rounded text-black"
              required
            >
              <option value="Administrador de proyectos">Administrador</option>
              <option value="Miembro de equipo">Miembro</option>
              <option value="Colaborador">Colaborador</option>
              <option value="Cliente">Cliente</option>
              <option value="Auditor">Auditor</option>
            </select>
          </div>
          
          <div className="mb-4">
            <label className="block text-sm font-medium mb-1 text-black">Estado</label>
            <select
              name="isActive"
              value={String(formData.isActive)}
              onChange={handleChange}
              className="w-full p-2 border rounded text-black"
            >
              <option value="true">Activo</option>
              <option value="false">Inactivo</option>
            </select>
          </div>
          
          <div className="mb-4">
            <label className="block text-sm font-medium mb-1 text-black">Notificaciones</label>
            <select
              name="notifications"
              value={String(formData.notifications)}
              onChange={handleChange}
              className="w-full p-2 border rounded text-black"
            >
              <option value="true">Activadas</option>
              <option value="false">Desactivadas</option>
            </select>
          </div>
          
          <div className="mb-4">
            <label className="block text-sm font-medium mb-1 text-black">Tema</label>
            <select
              name="theme"
              value={formData.theme || ''}
              onChange={handleChange}
              className="w-full p-2 border rounded text-black"
            >
              <option value="system">Sistema</option>
              <option value="light">Claro</option>
              <option value="dark">Oscuro</option>
            </select>
          </div>
          
          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-black hover:bg-gray-100 rounded"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700"
            >
              Crear
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateUserModal;