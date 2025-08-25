'use client';
import { useState } from 'react';

interface AddMemberModalProps {
  onClose: () => void;
  onAddMember: (email: string) => Promise<void>;
}

const AddMemberModal = ({ onClose, onAddMember }: AddMemberModalProps) => {
  const [email, setEmail] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    
    e.preventDefault();
    if (!email) return;
    setIsSubmitting(true);

    try {
      await onAddMember(email);
      onClose();
    } catch (error) {
        setError('No se pudo añadir al miembro. Verifica el email.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-gray-100/90 flex items-center justify-center z-50">
      <div className="bg-white border rounded-lg p-6 w-full max-w-md">
        <h2 className="text-xl font-bold mb-4 text-black">Añadir Miembro al Proyecto</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-sm font-medium mb-1 text-black">Email del Usuario</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-2 border rounded text-black"
              placeholder="ejemplo@correo.com"
              required
            />
          </div>
            {error && <p className="text-red-500 mb-4">{error}</p>}
          <div className="flex justify-end gap-2">
            <button type="button" onClick={onClose} className="px-4 py-2 text-black hover:bg-gray-100 rounded">
              Cancelar
            </button>
            <button type="submit" disabled={isSubmitting} className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700 disabled:bg-gray-400">
              {isSubmitting ? 'Añadiendo...' : 'Añadir'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddMemberModal;