'use client';

import { useState } from "react";
import { useRouter } from 'next/navigation';
import { login } from '@/services/authService';

export default function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const router = useRouter();

    const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault(); // Previene la recarga de la página
    setError('');

    try {
        const response = await login({ email, password });
        // Si llegamos aquí, el login en el backend fue exitoso.
        const userRole = response.user?.role;
        
        // Redirigir según el rol
        switch (userRole) {
            case 'Administrador de sistema':
            router.push('/admin/sistema/usuarios');
            break;
            case 'Auditor':
            router.push('/admin/sistema/auditoria');
            break;
            default:
            router.push('/inicio');
        }

    } catch (err) {
        // Si algo sale mal en la llamada a `login()`, se ejecutará esto.
        setError('Credenciales inválidas o error en el servidor.');
    }
};


    return (
        <div className="flex flex-row min-h-screen bg-white dark:bg-gray-900">
            {/* Sección del Formulario */}
            <div className="w-full md:w-1/2 flex flex-col justify-center p-8 md:p-16">
                <div className="mx-auto w-full max-w-md">
                    <h1 className="text-4xl font-bold text-gray-800 dark:text-gray-100">Inicia sesión</h1>

                    <form className="flex flex-col mt-8" onSubmit={handleSubmit}>
                        {error && <p className="text-red-500 dark:text-red-400 mb-4 text-center">{error}</p>}
                        
                        <label className="text-gray-700 dark:text-gray-300 mb-2">Correo</label>
                        <input 
                            type="email" 
                            value={email} 
                            onChange={(e) => setEmail(e.target.value)} 
                            className="border border-gray-300 rounded-lg p-3 mb-4 bg-gray-50 dark:bg-gray-800 dark:border-gray-600 dark:text-gray-200 focus:ring-2 focus:ring-green-500 focus:border-transparent" 
                            required 
                        />
                        
                        <label className="text-gray-700 dark:text-gray-300 mb-2 mt-4">Contraseña</label>
                        <input 
                            type="password" 
                            value={password} 
                            onChange={(e) => setPassword(e.target.value)} 
                            className="border border-gray-300 rounded-lg p-3 mb-8 bg-gray-50 dark:bg-gray-800 dark:border-gray-600 dark:text-gray-200 focus:ring-2 focus:ring-green-500 focus:border-transparent" 
                            required 
                        />
                        
                        <button 
                            type="submit" 
                            className="bg-green-500 text-white p-3 h-12 rounded-lg font-semibold hover:bg-green-600 dark:bg-green-600 dark:hover:bg-green-700 transition-colors"
                        >
                            Iniciar Sesión
                        </button>
                    </form>

                    <div className="text-center mt-6 text-gray-600 dark:text-gray-400">
                        <a href="/auth/olvide-contrasena" className="hover:underline text-green-600 dark:text-green-400">
                            ¿Olvidaste tu contraseña?
                        </a>
                    </div>
                    <div className="text-center mt-4 text-gray-600 dark:text-gray-400">
                        ¿No tienes cuenta?{' '}
                        <a href="/auth/signUp" className="font-semibold hover:underline text-green-600 dark:text-green-400">
                            Regístrate aquí
                        </a>
                    </div>
                </div>
            </div>

            {/* Sección de la Marca */}
            <div className="hidden md:flex flex-col w-1/2 bg-green-600 justify-center items-center p-12 text-white text-center">
                <a href="/">
                    <img
                        src="/ganttFlowWhite.svg"
                        alt="GanttFlow Logo"
                        width={346}
                        height={77}
                    />
                </a>
                <p className="mt-12 text-3xl font-medium max-w-md">
                    La solución que necesitas para tu proyecto
                </p>
            </div>
        </div>
    )
}
