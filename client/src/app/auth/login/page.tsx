'use client';

import { useState } from "react";
import { useRouter } from 'next/navigation';
import { login } from '@/services/authService';
import Image from "next/image";


export default function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const router = useRouter();


    const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault(); // Previene la recarga de la página
    setError('');
    console.log('1. El formulario fue enviado.');

    try {
        console.log('2. Intentando llamar al servicio de login...');
        await login({ email, password });
        
        // Si llegamos aquí, el login en el backend fue exitoso.
        console.log('3. Login exitoso. Redirigiendo a /inicio...');
        router.push('/inicio');

    } catch (err) {
        // Si algo sale mal en la llamada a `login()`, se ejecutará esto.
        console.error('4. Ocurrió un error:', err);
        setError('Credenciales inválidas o error en el servidor.');
    }
};


    return (
        <div className="flex flex-row h-screen">

            <div className="flex flex-col basis-1/2">
                <div className="flex flex-col w-2/3 self-center mt-30">
                    <h1 className="text-[36px]">Inicia sesión</h1>

                    <form className="flex flex-col mt-6" onSubmit={handleSubmit}>
                        {error && <p className="text-red-500 mb-6">{error}</p>}
                        <label>Correo</label>
                        <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="border border-gray-300 rounded-lg p-3 mb-4" required />
                        <label className="mt-4">Contraseña</label>
                        <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} className="border border-gray-300 rounded-lg p-3 mb-8" required />
                        <button type="submit" className="bg-green-500 text-white p-2 h-12 rounded-lg hover:bg-green-600">Iniciar Sesión</button>
                    </form>
                </div>
                <p className="mt-8 text-center"><a href="/auth/signUp" className="hover:underline">¿Olvidaste tu contraseña?</a></p>
                <p className="mt-4 text-center">¿No tienes cuenta? <a href="/auth/signUp" className="hover:underline">Regístrate aquí</a></p>
            </div>

            <div className="flex flex-col basis-1/2 bg-green-500">
                <div className="flex flex-col self-center mt-30">
                    <Image
                        className="dark:invert"
                        src="/ganttFlowWhite.svg"
                        alt="Gantt Logo"
                        width={346}
                        height={77}
                        priority
                    />
                </div>
                <p className="mt-30 text-center text-white text-[30px] w-2/3 self-center">La solución que necesitas para tu proyecto</p>
            </div>
        </div>
    )
}