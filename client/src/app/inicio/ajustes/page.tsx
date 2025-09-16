'use client';

import { useState, useEffect } from 'react';
// Importamos los servicios del frontend que definimos/actualizamos en pasos anteriores
import { getCurrentUser, updateUser, getUserById, AuthenticatedUser, User } from '@/services/userService'; 
import { changePassword } from '@/services/authService'; 
import { ShieldCheck } from 'lucide-react'; // Icono para 2FA

type CurrentUser = AuthenticatedUser['user'];

// Interfaz para el estado de los ajustes (basado en el modelo user.js)
interface UserSettings {
   theme: string;
   notifications: boolean;
   twoFactorEnabled: boolean; // Campo real de tu modelo
}

export default function AjustesPage() {
    const [user, setUser] = useState<CurrentUser | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    
    // Estado para el formulario de ajustes generales
    const [settings, setSettings] = useState<UserSettings>({
        theme: 'system',
        notifications: true,
        twoFactorEnabled: false,
    });
    
    // Estado para el formulario de contraseña
    const [passwordData, setPasswordData] = useState({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
    });

    // Mensajes de estado separados para cada formulario
    const [settingsMessage, setSettingsMessage] = useState({ text: '', isError: false });
    const [passwordMessage, setPasswordMessage] = useState({ text: '', isError: false });

    // Carga los datos reales del usuario al montar la página
    useEffect(() => {
        const fetchFullUser = async () => {
            try {
                // 1. Obtenemos el ID del usuario desde el token
                const authData = await getCurrentUser();
                if (authData.authenticated) {
                    const basicUser = authData.user;
                    setUser(basicUser);
                    
                    // 2. Usamos ese ID para obtener el objeto COMPLETO del usuario desde la BD
                    // (Esta es la función que añadimos al userService.tsx)
                    const fullUserData = await getUserById(basicUser._id);
                    
                    // 3. Poblamos el estado de los ajustes con los datos REALES de la BD
                    setSettings({
                        theme: fullUserData.theme || 'system',
                        notifications: fullUserData.notifications !== undefined ? fullUserData.notifications : true,
                        twoFactorEnabled: fullUserData.twoFactorEnabled || false,
                    });
                }
            } catch (error) {
                console.error("Error cargando los datos del usuario:", error);
                setSettingsMessage({ text: "Error al cargar tu configuración.", isError: true });
            } finally {
                setIsLoading(false);
            }
        };
        fetchFullUser();
    }, []);

    // Manejador genérico para todos los selects/toggles de ajustes
    const handleSettingsChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const { name, value } = e.target;
        // Convertir strings 'true'/'false' a booleanos reales
        const processedValue = value === 'true' ? true : value === 'false' ? false : value;
        
        setSettings(prev => ({ 
            ...prev, 
            [name]: processedValue
        }));
    };

    // Manejador para los inputs de contraseña
    const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setPasswordData({ ...passwordData, [e.target.name]: e.target.value });
    };

    // Envía el formulario de AJUSTES GENERALES
    const handleSettingsSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSettingsMessage({ text: 'Guardando...', isError: false });
        if (!user) return;
        
        try {
            // Llama a la API REAL: updateUser con los campos de configuración
            await updateUser(user._id, { 
                theme: settings.theme, 
                notifications: settings.notifications,
                twoFactorEnabled: settings.twoFactorEnabled
            });
            setSettingsMessage({ text: 'Ajustes guardados correctamente.', isError: false });
        } catch (error) {
            setSettingsMessage({ text: 'Error al guardar ajustes.', isError: true });
        }
    };

    // Envía el formulario de CAMBIO DE CONTRASEÑA
    const handlePasswordSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setPasswordMessage({ text: '', isError: false });

        if (!passwordData.newPassword || !passwordData.currentPassword) {
             setPasswordMessage({ text: 'Por favor, rellena todos los campos.', isError: true });
            return;
        }
        if (passwordData.newPassword !== passwordData.confirmPassword) {
            setPasswordMessage({ text: 'Las nuevas contraseñas no coinciden.', isError: true });
            return;
        }
        if (!user) return;

        try {
            setPasswordMessage({ text: 'Actualizando...', isError: false });
            
            // Llama al servicio de API REAL (POST /auth/change-password)
            await changePassword({
                currentPassword: passwordData.currentPassword,
                newPassword: passwordData.newPassword
            });
            
            setPasswordMessage({ text: 'Contraseña actualizada exitosamente.', isError: false });
            // Limpia los campos de contraseña por seguridad
            setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });

        } catch (error: any) {
            // Captura el mensaje de error específico del backend (ej. "Contraseña actual incorrecta")
            const message = error.response?.data?.message || 'Error al cambiar contraseña.';
            setPasswordMessage({ text: message, isError: true });
        }
    };

    // Mensaje de estado para formularios (reutilizable)
    const FormStatusMessage = ({ message }: { message: { text: string, isError: boolean }}) => {
        if (!message.text) return null;
        const textColor = message.isError ? 'text-red-600' : 'text-green-600';
        return <span className={`text-sm ${textColor}`}>{message.text}</span>;
    };


    if (isLoading) {
        return (
             <div className="flex-1 p-8 bg-gray-50 w-full space-y-8 animate-pulse">
                <div className="h-9 bg-gray-300 rounded w-1/3"></div>
                <div className="max-w-2xl mx-auto h-64 bg-gray-200 rounded-lg"></div>
                <div className="max-w-2xl mx-auto h-80 bg-gray-200 rounded-lg"></div>
            </div>
        );
    }

    return (
        <div className="flex-1 p-8 bg-gray-50 w-full space-y-8">
            <h1 className="text-3xl font-bold text-gray-800">Ajustes de Cuenta</h1>

            {/* --- SECCIÓN DE AJUSTES GENERALES (Funcional) --- */}
            <div className="max-w-2xl mx-auto bg-white p-8 rounded-lg shadow-sm border border-gray-200">
                <form onSubmit={handleSettingsSubmit} className="space-y-6">
                    <h2 className="text-xl font-semibold text-gray-900 border-b pb-4">Apariencia y Notificaciones</h2>
                    
                    <div>
                        <label htmlFor="theme" className="block text-sm font-medium text-gray-700 mb-1">Tema</label>
                        <select
                            id="theme"
                            name="theme"
                            value={settings.theme} // Controlado por el estado cargado
                            onChange={handleSettingsChange}
                            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:ring-indigo-500 focus:border-indigo-500"
                        >
                            <option value="system">Predeterminado del Sistema</option>
                            <option value="light">Claro</option>
                            <option value="dark">Oscuro</option>
                        </select>
                    </div>

                    <div>
                        <label htmlFor="notifications" className="block text-sm font-medium text-gray-700 mb-1">Activar Notificaciones</label>
                        <select
                            id="notifications"
                            name="notifications"
                            value={String(settings.notifications)} // Controlado por el estado cargado
                            onChange={handleSettingsChange}
                            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:ring-indigo-500 focus:border-indigo-500"
                        >
                            <option value="true">Activadas</option>
                            <option value="false">Desactivadas</option>
                        </select>
                    </div>
                    
                     <div className="flex justify-end items-center gap-4 border-t pt-6">
                        <FormStatusMessage message={settingsMessage} />
                        <button type="submit" className="px-6 py-2 rounded-md bg-indigo-600 text-white font-semibold hover:bg-indigo-700">
                            Guardar Ajustes
                        </button>
                    </div>
                </form>
            </div>

            {/* --- SECCIÓN DE SEGURIDAD (Funcional) --- */}
            <div className="max-w-2xl mx-auto bg-white p-8 rounded-lg shadow-sm border border-gray-200">
                <form onSubmit={handlePasswordSubmit} className="space-y-6">
                    <h2 className="text-xl font-semibold text-gray-900 border-b pb-4">Seguridad y Contraseña</h2>
                    
                    <div>
                        <label htmlFor="currentPassword" className="block text-sm font-medium text-gray-700 mb-1">Contraseña Actual</label>
                        <input required type="password" name="currentPassword" id="currentPassword" value={passwordData.currentPassword} onChange={handlePasswordChange} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3" />
                    </div>
                    <div>
                        <label htmlFor="newPassword" className="block text-sm font-medium text-gray-700 mb-1">Nueva Contraseña</label>
                        <input required type="password" name="newPassword" id="newPassword" value={passwordData.newPassword} onChange={handlePasswordChange} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3" />
                    </div>
                    <div>
                        <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-1">Confirmar Nueva Contraseña</label>
                        <input required type="password" name="confirmPassword" id="confirmPassword" value={passwordData.confirmPassword} onChange={handlePasswordChange} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3" />
                    </div>

                    <div className="flex justify-end items-center gap-4 border-t pt-6">
                        <FormStatusMessage message={passwordMessage} />
                        <button type="submit" className="px-6 py-2 rounded-md bg-indigo-600 text-white font-semibold hover:bg-indigo-700">
                            Cambiar Contraseña
                        </button>
                    </div>
                </form>
            </div>

            {/* --- SECCIÓN 2FA (Funcional) --- */}
            <div className="max-w-2xl mx-auto bg-white p-8 rounded-lg shadow-sm border border-gray-200">
                <form onSubmit={handleSettingsSubmit} className="space-y-4">
                    <h2 className="text-xl font-semibold text-gray-900 border-b pb-4">Autenticación de Dos Factores (2FA)</h2>
                    <div className="flex items-start gap-4">
                        <ShieldCheck className="w-10 h-10 text-gray-400 flex-shrink-0 mt-1" />
                        <div>
                            <label htmlFor="twoFactorEnabled" className="block text-sm font-medium text-gray-700">Estado de 2FA</label>
                            <p className="text-sm text-gray-500 mb-2">Añade una capa extra de seguridad a tu cuenta.</p>
                            <select
                                id="twoFactorEnabled"
                                name="twoFactorEnabled"
                                value={String(settings.twoFactorEnabled)} // Controlado por el estado cargado
                                onChange={handleSettingsChange}
                                className="mt-1 block w-full max-w-xs border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:ring-indigo-500 focus:border-indigo-500"
                            >
                                <option value="true">Habilitado</option>
                                <option value="false">Deshabilitado</option>
                            </select>
                        </div>
                    </div>
                     <div className="flex justify-end items-center gap-4 border-t pt-6">
                        <button type="submit" className="px-6 py-2 rounded-md bg-indigo-600 text-white font-semibold hover:bg-indigo-700">
                            Guardar Ajuste de 2FA
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}