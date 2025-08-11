'use client';

import { useState } from "react";
import { useRouter } from 'next/navigation';
import { registerAndLogin } from '@/services/authService';
import Image from "next/image";

// Roles
const userRoles = ['Administrador de proyectos', 'Miembro de equipo', 'Colaborador', 'Cliente', 'Auditor'];

export default function SignUpPage() {
    const [step, setStep] = useState(1);
    
    // Estado para los campos controlados
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

    // Maneja los cambios de los inputs de texto y el select
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
            // El servicio de autenticación necesitará ser modificado para manejar archivos
            // Por ahora, solo pasamos los datos del formulario, excluyendo la foto
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
                <form className="flex flex-col mt-6" onSubmit={handleNextStep}>
                    {error && <p className="text-red-500 mb-6">{error}</p>}
                    <label htmlFor="email">Correo</label>
                    <input type="email" name="email" value={email || ''} onChange={handleControlledChange} className="border border-gray-300 rounded-lg p-3 mb-4" required />

                    <label htmlFor="password">Contraseña</label>
                    <input type="password" name="password" value={password || ''} onChange={handleControlledChange} className="border border-gray-300 rounded-lg p-3 mb-4" required /> 

                    <label htmlFor="passwordConfirm">Confirmar Contraseña</label>
                    <input type="password" name="passwordConfirm" value={passwordConfirm || ''} onChange={handleControlledChange} className="border border-gray-300 rounded-lg p-3 mb-8" required />

                    <button type="submit" className="bg-green-500 text-white p-2 h-12 rounded-lg hover:bg-green-600">Siguiente</button>
                </form>
            );
        } else {
            return (
                <form className="flex flex-col mt-6" onSubmit={handleSubmit}>
                    {error && <p className="text-red-500 mb-6">{error}</p>}
                    <label htmlFor="name">Nombre</label>
                    <input type="text" name="name" value={name || ''} onChange={handleControlledChange} className="border border-gray-300 rounded-lg p-3 mb-4" required /> 

                    <label htmlFor="role">Tipo de Usuario</label>
                    <select name="role" value={role || ''} onChange={handleControlledChange} className="border border-gray-300 rounded-lg p-3 mb-4" required> 
                        <option value=''>Selecciona un rol</option>
                        {userRoles.map(r => (
                            <option key={r} value={r}>{r}</option>
                        ))}
                    </select>
                    
                    <label htmlFor="projectId">Código de Invitación (opcional)</label>
                    <input type="text" name="projectId" value={projectId || ''} onChange={handleControlledChange} className="border border-gray-300 rounded-lg p-3 mb-8" /> 

                    <button type="submit" className="bg-green-500 text-white p-2 h-12 rounded-lg hover:bg-green-600">Registrarme</button>
                </form>
            );
        }
    };


    return (
        <div className="flex flex-row h-screen">

            <div className="flex flex-col basis-1/2">
                <div className="flex flex-col w-2/3 self-center mt-30">
                    <h1 className="text-[36px]">
                        {step === 1 ? 'Crea tus credenciales' : 'Completa tu perfil'}
                    </h1>
                    {renderForm()}
                </div>
                <p className="mt-8 text-center">
                    {/* NOTA: Este enlace apunta a la misma página de registro, quizás debería ir a una página de "recuperar contraseña" */}
                    <a href="/auth/forgot-password" className="hover:underline">¿Olvidaste tu contraseña?</a>
                </p>
                <p className="mt-4 text-center">
                    ¿Ya tienes una cuenta? <a href="/auth/login" className="hover:underline">Inicia sesión aquí</a>
                </p>
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
    );
}