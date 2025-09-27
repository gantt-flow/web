'use client';
import { useState } from 'react';
import { invitationService, InvitationRequest } from '@/services/invitationService';

interface AddMemberModalProps {
  onClose: () => void;
  projectId: string;
  projectName: string;
  onInvitationSent?: () => void;
}

const AddMemberModal = ({ onClose, projectId, projectName, onInvitationSent }: AddMemberModalProps) => {
  const [email, setEmail] = useState('');
  const [role, setRole] = useState('user');
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setIsSubmitting(true);
    setError(null);

    try {
      const invitationData: InvitationRequest = {
        email,
        projectId,
        role
      };
      
      await invitationService.sendInvitation(invitationData);
      
      setSuccess(true);
      if (onInvitationSent) {
        onInvitationSent();
      }
      
      setTimeout(() => {
        onClose();
      }, 2000);
    } catch (error: any) {
      setError(error.message || 'No se pudo enviar la invitación. Verifica el email.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div onClick={onClose} className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
      <div onClick={(e) => e.stopPropagation()} className="bg-white dark:bg-gray-800 border dark:border-gray-700 rounded-lg p-6 w-full max-w-md">
        <h2 className="text-xl font-bold mb-4 text-black dark:text-gray-100">Invitar Miembro al Proyecto</h2>
        
        {success ? (
          <div className="text-green-700 dark:text-green-300 p-4 bg-green-100 dark:bg-green-900/50 border border-green-200 dark:border-green-800 rounded-md">
            <p className="font-semibold">¡Invitación enviada con éxito!</p>
            <p>Se ha enviado un correo a {email} para unirse al proyecto.</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label className="block text-sm font-medium mb-1 text-black dark:text-gray-300">Email del Usuario</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full p-2 border rounded text-black bg-white dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200 focus:ring-indigo-500 focus:border-indigo-500"
                placeholder="ejemplo@correo.com"
                required
              />
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium mb-1 text-black dark:text-gray-300">Rol</label>
              <select
                value={role}
                onChange={(e) => setRole(e.target.value)}
                className="w-full p-2 border rounded text-black bg-white dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200 focus:ring-indigo-500 focus:border-indigo-500"
              >
                <option value="Miembro de equipo" className="dark:bg-gray-700">Miembro de equipo</option>
                <option value="Administrador de proyectos" className="dark:bg-gray-700">Administrador de proyectos</option>
                <option value="Colaborador" className="dark:bg-gray-700">Colaborador</option>
                <option value="Cliente" className="dark:bg-gray-700">Cliente</option>
              </select>
            </div>
            
            {error && <p className="text-red-500 dark:text-red-400 mb-4">{error}</p>}
            
            <div className="flex justify-end gap-2">
              <button 
                type="button" 
                onClick={onClose} 
                className="px-4 py-2 text-black dark:text-gray-300 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded"
              >
                Cancelar
              </button>
              <button 
                type="submit" 
                disabled={isSubmitting} 
                className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700 disabled:bg-gray-400 dark:bg-indigo-500 dark:hover:bg-indigo-600 dark:disabled:bg-gray-500"
              >
                {isSubmitting ? 'Enviando...' : 'Enviar Invitación'}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default AddMemberModal;

