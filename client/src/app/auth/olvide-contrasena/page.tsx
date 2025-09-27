'use client';

import { useState } from 'react';
import Link from 'next/link';
import { forgotPassword } from '@/services/authService';

export default function ForgotPasswordPage() {
    const [email, setEmail] = useState('');
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setIsLoading(true);
        setError('');
        setMessage('');

        try {
            const response = await forgotPassword(email);
            setMessage(response.message);
        } catch (err: any) {
            setError(err.message);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-900">
            <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-lg shadow-md dark:bg-gray-800">
                <div className="text-center">
                    <h1 className="text-2xl font-bold text-gray-800 dark:text-gray-100">¿Olvidaste tu contraseña?</h1>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                        No te preocupes. Ingresa tu correo electrónico y te enviaremos un enlace para restablecerla.
                    </p>
                </div>
                
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label htmlFor="email" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                            Correo Electrónico
                        </label>
                        <input
                            id="email"
                            name="email"
                            type="email"
                            autoComplete="email"
                            required
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full px-3 py-2 mt-1 border border-gray-300 rounded-md shadow-sm bg-gray-50 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200 focus:ring-green-500 focus:border-green-500"
                            placeholder="tu@email.com"
                        />
                    </div>

                    {message && (
                        <div className="p-3 text-sm text-green-800 bg-green-100 border border-green-200 rounded-md dark:bg-green-900/50 dark:text-green-300 dark:border-green-800">
                            {message}
                        </div>
                    )}
                    {error && (
                         <div className="p-3 text-sm text-red-800 bg-red-100 border border-red-200 rounded-md dark:bg-red-900/50 dark:text-red-300 dark:border-red-800">
                            {error}
                        </div>
                    )}

                    <div>
                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full px-4 py-2 font-semibold text-white bg-green-500 rounded-md hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:bg-gray-400 dark:focus:ring-offset-gray-800 dark:disabled:bg-gray-600 transition-colors"
                        >
                            {isLoading ? 'Enviando...' : 'Enviar Enlace'}
                        </button>
                    </div>
                </form>

                <div className="text-sm text-center text-gray-600 dark:text-gray-400">
                    <Link href="/auth/login" className="font-medium text-green-600 hover:text-green-500 dark:text-green-400 dark:hover:text-green-300">
                        Volver a Iniciar Sesión
                    </Link>
                </div>
            </div>
        </div>
    );
}

