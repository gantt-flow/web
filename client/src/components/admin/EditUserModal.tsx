// components/admin/EditUserModal.tsx
'use client';
import { useState, useEffect } from 'react';
import { User } from '@/services/userService';

interface EditUserModalProps {
  user: User | null;
  onClose: () => void;
  onSave: (updatedUser: User) => void;
}

const EditUserModal = ({ user, onClose, onSave }: EditUserModalProps) => {
  const [formData, setFormData] = useState<User | null>(null);

  useEffect(() => {
    if (user) {
      setFormData({ ...user });
    }
  }, [user]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    if (!formData) return;
    
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: name === 'isActive' ? (value === 'true') : value
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (formData) {
      onSave(formData);
      onClose();
    }
  };

  if (!user || !formData) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md">
        <h2 className="text-xl font-bold mb-4 text-black">Editar Usuario</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-sm font-medium mb-1 text-black">Nombre</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="w-full p-2 border rounded text-black"
              required
            />
          </div>
          
          <div className="mb-4">
            <label className="block text-sm font-medium mb-1 text-black">Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full p-2 border rounded text-black"
              required
              disabled
            />
          </div>
          
          <div className="mb-4">
            <label className="block text-sm font-medium mb-1 text-black">Rol</label>
            <select
              name="role"
              value={formData.role}
              onChange={handleChange}
              className="w-full p-2 border rounded text-black"
              required
            >
              <option value="Administrador de sistema" className="text-black">Administrador de sistema</option>
              <option value="Administrador de proyectos" className="text-black">Administrador de proyectos</option>
              <option value="Miembro de equipo" className="text-black">Miembro</option>
              <option value="Colaborador"className="text-black">Colaborador</option>
              <option value="Cliente" className="text-black">Cliente</option>
              <option value="Auditor" className="text-black">Auditor</option>
            </select>
          </div>
          
          <div className="mb-4">
            <label className="block text-sm font-medium mb-1 text-black">Estado</label>
            <select
              name="isActive"
              value={String(formData.isActive)}
              onChange={handleChange}
              className="w-full p-2 border rounded text-black"
              required
            >
              <option value="true" className="text-black">Activo</option>
              <option value="false" className="text-black">Inactivo</option>
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
              Guardar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditUserModal;