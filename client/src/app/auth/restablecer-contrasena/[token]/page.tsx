'use client';

import { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { resetPassword } from '@/services/authService';

export default function ResetPasswordPage() {
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const params = useParams();
    const router = useRouter();
    const token = params.token as string; // Obtenemos el token de la URL

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        
        if (password !== confirmPassword) {
            setError('Las contraseñas no coinciden.');
            return;
        }

        setIsLoading(true);
        setError('');
        setMessage('');

        try {
            const response = await resetPassword({ token, password });
            setMessage(response.message + " Serás redirigido para iniciar sesión.");
            // Redirigir al login después de unos segundos
            setTimeout(() => {
                router.push('/auth/login');
            }, 3000);
        } catch (err: any) {
            setError(err.message);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-100">
            <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-lg shadow-md">
                <h1 className="text-2xl font-bold text-center text-gray-800">Restablecer Contraseña</h1>
                
                {message ? (
                    <div className="p-3 text-sm text-green-700 bg-green-100 border border-green-200 rounded-md">
                        {message}
                    </div>
                ) : (
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div>
                            <label htmlFor="password-new" className="text-sm font-medium text-gray-700">
                                Nueva Contraseña
                            </label>
                            <input
                                id="password-new"
                                name="password"
                                type="password"
                                required
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full px-3 py-2 mt-1 border border-gray-300 rounded-md shadow-sm focus:ring-green-500 focus:border-green-500"
                                placeholder="••••••••"
                            />
                        </div>
                        <div>
                            <label htmlFor="password-confirm" className="text-sm font-medium text-gray-700">
                                Confirmar Contraseña
                            </label>
                            <input
                                id="password-confirm"
                                name="confirmPassword"
                                type="password"
                                required
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                className="w-full px-3 py-2 mt-1 border border-gray-300 rounded-md shadow-sm focus:ring-green-500 focus:border-green-500"
                                placeholder="••••••••"
                            />
                        </div>

                        {error && (
                             <div className="p-3 text-sm text-red-700 bg-red-100 border border-red-200 rounded-md">
                                {error}
                            </div>
                        )}

                        <div>
                            <button
                                type="submit"
                                disabled={isLoading}
                                className="w-full px-4 py-2 font-semibold text-white bg-green-500 rounded-md hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:bg-gray-400"
                            >
                                {isLoading ? 'Actualizando...' : 'Restablecer Contraseña'}
                            </button>
                        </div>
                    </form>
                )}
            </div>
        </div>
    );
}