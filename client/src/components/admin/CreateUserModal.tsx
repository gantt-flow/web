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
    //readOnly: false,
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
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 transition-opacity duration-300">
      <div className="bg-gray-50 p-8 rounded-xl shadow-2xl w-full max-w-md max-h-[90vh] overflow-y-auto">
        <h2 className="text-2xl font-bold mb-6 text-gray-800 border-b pb-4">Crear Nuevo Usuario</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">Nombre*</label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name || ''}
              onChange={handleChange}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:ring-indigo-500 focus:border-indigo-500"
              required
            />
          </div>
          
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">Email*</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email || ''}
              onChange={handleChange}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:ring-indigo-500 focus:border-indigo-500"
              required
            />
          </div>
          
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">Contraseña*</label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password || ''}
              onChange={handleChange}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:ring-indigo-500 focus:border-indigo-500"
              required
            />
          </div>
          
          <div>
            <label htmlFor="role" className="block text-sm font-medium text-gray-700 mb-1">Rol*</label>
            <select
              id="role"
              name="role"
              value={formData.role || ''}
              onChange={handleChange}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:ring-indigo-500 focus:border-indigo-500"
              required
            >
              <option value="Administrador de sistema">Administrador de sistema</option>
              <option value="Administrador de proyectos">Administrador de proyectos</option>
              <option value="Miembro de equipo">Miembro</option>
              <option value="Colaborador">Colaborador</option>
              <option value="Cliente">Cliente</option>
              <option value="Auditor">Auditor</option>
            </select>
          </div>
          
          <div>
            <label htmlFor="isActive" className="block text-sm font-medium text-gray-700 mb-1">Estado</label>
            <select
              id="isActive"
              name="isActive"
              value={String(formData.isActive)}
              onChange={handleChange}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:ring-indigo-500 focus:border-indigo-500"
            >
              <option value="true">Activo</option>
              <option value="false">Inactivo</option>
            </select>
          </div>
          
          <div>
            <label htmlFor="notifications" className="block text-sm font-medium text-gray-700 mb-1">Notificaciones</label>
            <select
              id="notifications"
              name="notifications"
              value={String(formData.notifications)}
              onChange={handleChange}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:ring-indigo-500 focus:border-indigo-500"
            >
              <option value="true">Activadas</option>
              <option value="false">Desactivadas</option>
            </select>
          </div>
          
          <div>
            <label htmlFor="theme" className="block text-sm font-medium text-gray-700 mb-1">Tema</label>
            <select
              id="theme"
              name="theme"
              value={formData.theme || ''}
              onChange={handleChange}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:ring-indigo-500 focus:border-indigo-500"
            >
              <option value="system">Sistema</option>
              <option value="light">Claro</option>
              <option value="dark">Oscuro</option>
            </select>
          </div>
          
          <div className="flex justify-end gap-4 mt-8 pt-4 border-t">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-md border bg-white text-gray-700 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-6 py-2 rounded-md bg-indigo-600 text-white font-semibold hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
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