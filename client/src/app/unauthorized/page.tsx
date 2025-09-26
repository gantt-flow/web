// src/app/unauthorized/page.tsx
import Link from 'next/link';

export default function UnauthorizedPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="max-w-md w-full bg-white p-8 rounded-lg shadow-md text-center">
        <div className="text-red-500 text-6xl mb-4"><img src="/prohibido.jpg" alt="Logo prohibido" className="w-100 h-50 object-contain"/></div>
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Acceso Denegado</h1>
        <p className="text-gray-600 mb-6">
          No tienes los permisos necesarios para acceder a esta página.
          Contacta al administrador del sistema si necesitas acceso.
        </p>
        <div className="space-y-3">
          <Link 
            href="/inicio" 
            className="block w-full bg-indigo-600 text-white px-6 py-2 rounded-md hover:bg-indigo-700 transition-colors"
          >
            Volver al Inicio
          </Link>
          <Link 
            href="/auth" 
            className="block w-full border border-gray-300 text-gray-700 px-6 py-2 rounded-md hover:bg-gray-50 transition-colors"
          >
            Ir al Login
          </Link>
        </div>
      </div>
    </div>
  );
}