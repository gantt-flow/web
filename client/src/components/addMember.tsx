'use client';
import { useState } from 'react';
import { invitationService, InvitationRequest } from '@/services/invitationService';

interface AddMemberModalProps {
  onClose: () => void;
  projectId: string;
  projectName: string;
  onInvitationSent?: () => void; // Nueva prop opcional para notificar éxito
}

const AddMemberModal = ({ onClose, projectId, projectName, onInvitationSent }: AddMemberModalProps) => {
  const [email, setEmail] = useState('');
  const [role, setRole] = useState('');
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
    <div className="fixed inset-0 bg-gray-100/90 flex items-center justify-center z-50">
      <div className="bg-white border rounded-lg p-6 w-full max-w-md">
        <h2 className="text-xl font-bold mb-4 text-black">Invitar Miembro al Proyecto</h2>
        
        {success ? (
          <div className="text-green-600 mb-4">
            <p>¡Invitación enviada con éxito!</p>
            <p>Se ha enviado un correo a {email} para unirse al proyecto.</p>
          </div>
        ) : (
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

            <div className="mb-4">
              <label className="block text-sm font-medium mb-1 text-black">Rol</label>
              <select
                value={role}
                onChange={(e) => setRole(e.target.value)}
                className="w-full p-2 border rounded text-black"
              >
                <option value="Miembro de equipo">Miembro de equipo</option>
                <option value="Administrador de proyectos">Administrador de proyectos</option>
                <option value="Colaborador">Colaborador</option>
                <option value="Cliente">Cliente</option>
              </select>
            </div>
            
            {error && <p className="text-red-500 mb-4">{error}</p>}
            
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
                disabled={isSubmitting} 
                className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700 disabled:bg-gray-400"
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