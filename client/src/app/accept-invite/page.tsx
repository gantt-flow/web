// web/client/src/app/accept-invite/page.tsx
'use client';

import { Suspense } from 'react';
import { useState, useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { invitationService } from '@/services/invitationService';

function AcceptInviteContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const token = searchParams.get('token');
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [message, setMessage] = useState('');

  useEffect(() => {
    const acceptInvitation = async () => {
      if (!token) {
        setStatus('error');
        setMessage('Token de invitación no válido');
        return;
      }

      try {
        const result = await invitationService.acceptInvitation(token);
        setStatus('success');
        setMessage(`${result.message} Ahora eres miembro del proyecto "${result.projectName}".`);
        
        setTimeout(() => {
          router.push(`/inicio/proyectos/${result.projectId}`);
        }, 3000);
      } catch (error: any) {
        setStatus('error');
        setMessage(error.message || 'Error al aceptar la invitación');
      }
    };

    acceptInvitation();
  }, [token, router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full bg-white p-8 rounded-lg shadow-md">
        <h1 className="text-2xl font-bold mb-6 text-center">Aceptar Invitación</h1>
        
        {status === 'loading' && (
          <div className="text-center">
            <p>Procesando invitación...</p>
          </div>
        )}
        
        {status === 'success' && (
          <div className="text-center text-green-600">
            <p>{message}</p>
            <p>Serás redirigido al proyecto en unos segundos.</p>
          </div>
        )}
        
        {status === 'error' && (
          <div className="text-center text-red-600">
            <p>{message}</p>
            <button 
              onClick={() => router.push('/inicio')}
              className="mt-4 px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700"
            >
              Ir al Inicio
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default function AcceptInvitePage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="max-w-md w-full bg-white p-8 rounded-lg shadow-md">
          <h1 className="text-2xl font-bold mb-6 text-center">Aceptar Invitación</h1>
          <div className="text-center">
            <p>Cargando...</p>
          </div>
        </div>
      </div>
    }>
      <AcceptInviteContent />
    </Suspense>
  );
}