'use client';

import { useState, useEffect } from 'react';
import { getCurrentUser, updateUser, AuthenticatedUser } from '@/services/userService';
import Image from 'next/image';

type CurrentUser = AuthenticatedUser['user'];

export default function PerfilPage() {
    const [user, setUser] = useState<CurrentUser | null>(null);
    const [formData, setFormData] = useState({ name: '', email: '' });
    const [isLoading, setIsLoading] = useState(true);
    const [message, setMessage] = useState('');

    useEffect(() => {
        const fetchUser = async () => {
            try {
                // LLAMADA A DATOS REALES
                const authData = await getCurrentUser();
                if (authData.authenticated) {
                    setUser(authData.user);
                    setFormData({ name: authData.user.name, email: authData.user.email });
                }
            } catch (error) {
                console.error("Error cargando el usuario:", error);
            } finally {
                setIsLoading(false);
            }
        };
        fetchUser();
    }, []);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setMessage('');
        if (!user) return;

        try {
            // LLAMADA A API REAL
            await updateUser(user._id, { name: formData.name, email: formData.email });
            setMessage('Perfil actualizado correctamente');
            
            // Actualizar el estado local del usuario por si vuelve a guardar
            setUser(prevUser => prevUser ? { ...prevUser, ...formData } : null);

        } catch (error) {
            console.error("Error actualizando perfil:", error);
            setMessage('Error al actualizar el perfil');
        }
    };

    if (isLoading) {
        return (
            <div className="p-8 w-full animate-pulse">
                <div className="h-8 bg-gray-300 rounded w-1/4 mb-8"></div>
                <div className="max-w-2xl mx-auto h-96 bg-gray-200 rounded-lg"></div>
            </div>
        );
    }

    return (
        <div className="flex-1 p-8 bg-gray-50 w-full">
            <h1 className="text-3xl font-bold text-gray-800 mb-8">Mi Perfil</h1>
            
            <div className="max-w-2xl mx-auto bg-white p-8 rounded-lg shadow-sm border border-gray-200">
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="flex items-center space-x-6">
                        <Image 
                            src="/defaultUserPicture.svg" // TODO: Cargar user.profilePicture cuando esté disponible
                            alt="Foto de perfil"
                            width={80}
                            height={80}
                            className="rounded-full bg-gray-200"
                        />
                        <div>
                            <button type="button" className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700">
                                Cambiar foto
                            </button>
                            <p className="text-xs text-gray-500 mt-2">JPG o PNG. Tamaño máx. 5MB.</p>
                        </div>
                    </div>

                    <div className="border-t pt-6">
                        <div>
                            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">Nombre Completo</label>
                            <input
                                type="text"
                                name="name"
                                id="name"
                                value={formData.name}
                                onChange={handleChange}
                                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:ring-indigo-500 focus:border-indigo-500"
                            />
                        </div>

                        <div className="mt-4">
                            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">Correo Electrónico</label>
                            <input
                                type="email"
                                name="email"
                                id="email"
                                value={formData.email}
                                onChange={handleChange}
                                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:ring-indigo-500 focus:border-indigo-500"
                            />
                        </div>
                    </div>

                    <div className="flex justify-end items-center gap-4 border-t pt-6">
                        {message && <span className={`text-sm ${message.startsWith('Error') ? 'text-red-600' : 'text-green-600'}`}>{message}</span>}
                        <button type="submit" className="px-6 py-2 rounded-md bg-indigo-600 text-white font-semibold hover:bg-indigo-700">
                            Guardar Cambios
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}