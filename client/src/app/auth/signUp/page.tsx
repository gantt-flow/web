'use client';

import { useState } from "react";
import { useRouter } from 'next/navigation';
import { registerAndLogin } from '@/services/authService';

const userRoles = ['Administrador de proyectos', 'Miembro de equipo', 'Cliente', 'Auditor'];

export default function SignUpPage() {
    const [step, setStep] = useState(1);
    
    const [formData, setFormData] = useState({
        email: '',
        password: '',
        passwordConfirm: '',
        name: '',
        role: '',
        projectId: ''
    });

    const [error, setError] = useState('');
    const router = useRouter();

    const { email, password, passwordConfirm, name, role, projectId } = formData;

    const handleControlledChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleNextStep = (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        if (step === 1) {
            if (!email || !password || !passwordConfirm) {
                setError('Por favor, completa todos los campos.');
                return;
            }
            if (password !== passwordConfirm) {
                setError('Las contraseñas no coinciden.');
                return;
            }
            setStep(2);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!name || !role) {
            setError('Nombre y tipo de usuario son obligatorios.');
            return;
        }

        try {
            await registerAndLogin({ email, password, name, role, projectId });
            router.push('/inicio');
        } catch (err: any) {
            console.error(err);
            const errorMessage = err.response?.data?.message || 'Error en el registro. Por favor, intenta de nuevo.';
            setError(errorMessage);
        }
    };

    const renderForm = () => {
        if (step === 1) {
            return (
                <form className="flex flex-col mt-8" onSubmit={handleNextStep}>
                    {error && <p className="text-red-500 dark:text-red-400 mb-4 text-center">{error}</p>}
                    <label htmlFor="email" className="text-gray-700 dark:text-gray-300 mb-2">Correo</label>
                    <input type="email" name="email" value={email || ''} onChange={handleControlledChange} className="border border-gray-300 rounded-lg p-3 mb-4 bg-gray-50 dark:bg-gray-800 dark:border-gray-600 dark:text-gray-200 focus:ring-2 focus:ring-green-500 focus:border-transparent" required />

                    <label htmlFor="password"  className="text-gray-700 dark:text-gray-300 mb-2 mt-4">Contraseña</label>
                    <input type="password" name="password" value={password || ''} onChange={handleControlledChange} className="border border-gray-300 rounded-lg p-3 mb-4 bg-gray-50 dark:bg-gray-800 dark:border-gray-600 dark:text-gray-200 focus:ring-2 focus:ring-green-500 focus:border-transparent" required /> 

                    <label htmlFor="passwordConfirm"  className="text-gray-700 dark:text-gray-300 mb-2 mt-4">Confirmar Contraseña</label>
                    <input type="password" name="passwordConfirm" value={passwordConfirm || ''} onChange={handleControlledChange} className="border border-gray-300 rounded-lg p-3 mb-8 bg-gray-50 dark:bg-gray-800 dark:border-gray-600 dark:text-gray-200 focus:ring-2 focus:ring-green-500 focus:border-transparent" required />

                    <button type="submit" className="bg-green-500 text-white p-3 h-12 rounded-lg font-semibold hover:bg-green-600 dark:bg-green-600 dark:hover:bg-green-700 transition-colors">Siguiente</button>
                </form>
            );
        } else {
            return (
                <form className="flex flex-col mt-8" onSubmit={handleSubmit}>
                    {error && <p className="text-red-500 dark:text-red-400 mb-4 text-center">{error}</p>}
                    <label htmlFor="name" className="text-gray-700 dark:text-gray-300 mb-2">Nombre</label>
                    <input type="text" name="name" value={name || ''} onChange={handleControlledChange} className="border border-gray-300 rounded-lg p-3 mb-4 bg-gray-50 dark:bg-gray-800 dark:border-gray-600 dark:text-gray-200 focus:ring-2 focus:ring-green-500 focus:border-transparent" required /> 

                    <label htmlFor="role" className="text-gray-700 dark:text-gray-300 mb-2 mt-4">Tipo de Usuario</label>
                    <select name="role" value={role || ''} onChange={handleControlledChange} className="border border-gray-300 rounded-lg p-3 mb-4 bg-gray-50 dark:bg-gray-800 dark:border-gray-600 dark:text-gray-200 focus:ring-2 focus:ring-green-500 focus:border-transparent" required> 
                        <option value='' className="text-gray-500">Selecciona un rol</option>
                        {userRoles.map(r => (
                            <option key={r} value={r} className="dark:bg-gray-800">{r}</option>
                        ))}
                    </select>
                    
                    <label htmlFor="projectId" className="text-gray-700 dark:text-gray-300 mb-2 mt-4">Código de Invitación (opcional)</label>
                    <input type="text" name="projectId" value={projectId || ''} onChange={handleControlledChange} className="border border-gray-300 rounded-lg p-3 mb-8 bg-gray-50 dark:bg-gray-800 dark:border-gray-600 dark:text-gray-200 focus:ring-2 focus:ring-green-500 focus:border-transparent" /> 

                    <button type="submit" className="bg-green-500 text-white p-3 h-12 rounded-lg font-semibold hover:bg-green-600 dark:bg-green-600 dark:hover:bg-green-700 transition-colors">Registrarme</button>
                </form>
            );
        }
    };

    return (
        <div className="flex flex-row min-h-screen bg-white dark:bg-gray-900">
            <div className="w-full md:w-1/2 flex flex-col justify-center p-8 md:p-16">
                <div className="mx-auto w-full max-w-md">
                    <h1 className="text-4xl font-bold text-gray-800 dark:text-gray-100">
                        {step === 1 ? 'Crea tus credenciales' : 'Completa tu perfil'}
                    </h1>
                    {renderForm()}
                    <div className="text-center mt-6 text-sm text-gray-600 dark:text-gray-400">
                        <a href="/auth/olvide-contrasena" className="hover:underline font-semibold text-green-600 dark:text-green-400">¿Olvidaste tu contraseña?</a>
                    </div>
                    <div className="text-center mt-4 text-sm text-gray-600 dark:text-gray-400">
                        ¿Ya tienes una cuenta? <a href="/auth/login" className="hover:underline font-semibold text-green-600 dark:text-green-400">Inicia sesión aquí</a>
                    </div>
                </div>
            </div>

            <div className="hidden md:flex flex-col w-1/2 bg-green-600 justify-center items-center p-12 text-white text-center">
                <a href="/">
                    <img
                        src="/ganttFlowWhite.svg"
                        alt="Gantt Logo"
                        width={346}
                        height={77}
                    />
                </a>
                <p className="mt-12 text-3xl font-medium max-w-md">La solución que necesitas para tu proyecto</p>
            </div>
        </div>
    );
}