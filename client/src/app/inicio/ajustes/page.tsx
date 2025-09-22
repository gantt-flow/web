'use client';

import { useState, useEffect } from 'react';
import { getCurrentUser, updateUser, getUserById, AuthenticatedUser, User } from '@/services/userService'; 
import { changePassword } from '@/services/authService'; 
import { ShieldCheck } from 'lucide-react';

type CurrentUser = AuthenticatedUser['user'];

interface UserSettings {
   theme: string;
   notifications: boolean;
   twoFactorEnabled: boolean;
}

export default function AjustesPage() {
    const [user, setUser] = useState<CurrentUser | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    
    const [settings, setSettings] = useState<UserSettings>({
        theme: 'system',
        notifications: true,
        twoFactorEnabled: false,
    });
    
    const [passwordData, setPasswordData] = useState({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
    });

    const [settingsMessage, setSettingsMessage] = useState({ text: '', isError: false });
    const [passwordMessage, setPasswordMessage] = useState({ text: '', isError: false });

    // --- MEJORA 1: EFECTO PARA APLICAR EL TEMA VISUALMENTE ---
    // Este useEffect se ejecutará cada vez que el tema en el estado 'settings' cambie.
    useEffect(() => {
        const root = window.document.documentElement; // La etiqueta <html>
        const currentTheme = settings.theme;

        // Limpiamos clases de tema anteriores
        root.classList.remove('light', 'dark');

        if (currentTheme === 'system') {
            // Si es 'system', usamos la preferencia del sistema operativo
            const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
            root.classList.add(systemTheme);
        } else {
            // Si es 'light' o 'dark', aplicamos esa clase directamente
            root.classList.add(currentTheme);
        }
    }, [settings.theme]); // Se dispara al cargar y cada vez que settings.theme cambia

    // Carga los datos reales del usuario al montar la página
    useEffect(() => {
        const fetchFullUser = async () => {
            try {
                const authData = await getCurrentUser();
                if (authData.authenticated) {
                    const basicUser = authData.user;
                    setUser(basicUser);
                    
                    // Esta es la lógica CORRECTA: obtenemos el ID del token y luego los datos FRESCOS de la BD.
                    const fullUserData = await getUserById(basicUser._id);
                    
                    // Poblamos el estado de los ajustes con los datos REALES de la BD
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

    // Manejador para los selects/toggles
    const handleSettingsChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const { name, value } = e.target;
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

    // --- MEJORA 2: ACTUALIZAR EL ESTADO LOCAL TRAS GUARDAR ---
    const handleSettingsSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSettingsMessage({ text: 'Guardando...', isError: false });
        if (!user) return;
        
        try {
            // Llama a la API y recibe el usuario actualizado
            const updatedUserData = await updateUser(user._id, { 
                theme: settings.theme, 
                notifications: settings.notifications,
                twoFactorEnabled: settings.twoFactorEnabled
            });

            // Actualiza el estado local con los datos FRESCOS del servidor.
            // Esto asegura que la UI refleje el estado real de la BD sin necesidad de refrescar.
            setUser(updatedUserData); 
            setSettings({
                theme: updatedUserData.theme || 'system',
                notifications: updatedUserData.notifications !== undefined ? updatedUserData.notifications : true,
                twoFactorEnabled: updatedUserData.twoFactorEnabled || false,
            });
            
            setSettingsMessage({ text: 'Ajustes guardados correctamente.', isError: false });
            // El mensaje desaparecerá después de 3 segundos
            setTimeout(() => setSettingsMessage({ text: '', isError: false }), 3000);

        } catch (error) {
            setSettingsMessage({ text: 'Error al guardar ajustes.', isError: true });
        }
    };

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
            
            await changePassword({
                currentPassword: passwordData.currentPassword,
                newPassword: passwordData.newPassword
            });
            
            setPasswordMessage({ text: 'Contraseña actualizada exitosamente.', isError: false });
            setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
             // El mensaje desaparecerá después de 3 segundos
            setTimeout(() => setPasswordMessage({ text: '', isError: false }), 3000);

        } catch (error: any) {
            const message = error.response?.data?.message || 'Error al cambiar contraseña.';
            setPasswordMessage({ text: message, isError: true });
        }
    };

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
        <div className="flex-1 p-8 bg-gray-50 dark:bg-gray-900 w-full space-y-8">
            <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-100">Ajustes de Cuenta</h1>

            {/* --- SECCIÓN DE AJUSTES GENERALES --- */}
            <div className="max-w-2xl mx-auto bg-white dark:bg-gray-800 p-8 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
                <form onSubmit={handleSettingsSubmit} className="space-y-6">
                    <h2 className="text-xl font-semibold text-gray-900 dark:text-white border-b dark:border-gray-600 pb-4">Apariencia y Notificaciones</h2>
                    
                    <div>
                        <label htmlFor="theme" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Tema</label>
                        <select
                            id="theme"
                            name="theme"
                            value={settings.theme}
                            onChange={handleSettingsChange}
                            className="mt-1 block w-full border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-200 rounded-md shadow-sm py-2 px-3 focus:ring-indigo-500 focus:border-indigo-500"
                        >
                            <option value="system">Predeterminado del Sistema</option>
                            <option value="light">Claro</option>
                            <option value="dark">Oscuro</option>
                        </select>
                    </div>

                    <div>
                        <label htmlFor="notifications" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Activar Notificaciones</label>
                        <select
                            id="notifications"
                            name="notifications"
                            value={String(settings.notifications)}
                            onChange={handleSettingsChange}
                            className="mt-1 block w-full border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-200 rounded-md shadow-sm py-2 px-3 focus:ring-indigo-500 focus:border-indigo-500"
                        >
                            <option value="true">Activadas</option>
                            <option value="false">Desactivadas</option>
                        </select>
                    </div>
                    
                     <div className="flex justify-end items-center gap-4 border-t dark:border-gray-600 pt-6">
                        <FormStatusMessage message={settingsMessage} />
                        <button type="submit" className="px-6 py-2 rounded-md bg-indigo-600 text-white font-semibold hover:bg-indigo-700">
                            Guardar Ajustes
                        </button>
                    </div>
                </form>
            </div>

            {/* --- SECCIÓN DE SEGURIDAD --- */}
            <div className="max-w-2xl mx-auto bg-white dark:bg-gray-800 p-8 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
                <form onSubmit={handlePasswordSubmit} className="space-y-6">
                    <h2 className="text-xl font-semibold text-gray-900 dark:text-white border-b dark:border-gray-600 pb-4">Seguridad y Contraseña</h2>
                    
                    <div>
                        <label htmlFor="currentPassword" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Contraseña Actual</label>
                        <input required type="password" name="currentPassword" id="currentPassword" value={passwordData.currentPassword} onChange={handlePasswordChange} className="mt-1 block w-full border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-200 rounded-md shadow-sm py-2 px-3" />
                    </div>
                    <div>
                        <label htmlFor="newPassword" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Nueva Contraseña</label>
                        <input required type="password" name="newPassword" id="newPassword" value={passwordData.newPassword} onChange={handlePasswordChange} className="mt-1 block w-full border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-200 rounded-md shadow-sm py-2 px-3" />
                    </div>
                    <div>
                        <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Confirmar Nueva Contraseña</label>
                        <input required type="password" name="confirmPassword" id="confirmPassword" value={passwordData.confirmPassword} onChange={handlePasswordChange} className="mt-1 block w-full border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-200 rounded-md shadow-sm py-2 px-3" />
                    </div>

                    <div className="flex justify-end items-center gap-4 border-t dark:border-gray-600 pt-6">
                        <FormStatusMessage message={passwordMessage} />
                        <button type="submit" className="px-6 py-2 rounded-md bg-indigo-600 text-white font-semibold hover:bg-indigo-700">
                            Cambiar Contraseña
                        </button>
                    </div>
                </form>
            </div>

            {/* --- SECCIÓN 2FA --- */}
            <div className="max-w-2xl mx-auto bg-white dark:bg-gray-800 p-8 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
                <form onSubmit={handleSettingsSubmit} className="space-y-4">
                    <h2 className="text-xl font-semibold text-gray-900 dark:text-white border-b dark:border-gray-600 pb-4">Autenticación de Dos Factores (2FA)</h2>
                    <div className="flex items-start gap-4">
                        <ShieldCheck className="w-10 h-10 text-gray-400 flex-shrink-0 mt-1" />
                        <div>
                            <label htmlFor="twoFactorEnabled" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Estado de 2FA</label>
                            <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">Añade una capa extra de seguridad a tu cuenta.</p>
                            <select
                                id="twoFactorEnabled"
                                name="twoFactorEnabled"
                                value={String(settings.twoFactorEnabled)}
                                onChange={handleSettingsChange}
                                className="mt-1 block w-full max-w-xs border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-200 rounded-md shadow-sm py-2 px-3 focus:ring-indigo-500 focus:border-indigo-500"
                            >
                                <option value="true">Habilitado</option>
                                <option value="false">Deshabilitado</option>
                            </select>
                        </div>
                    </div>
                     <div className="flex justify-end items-center gap-4 border-t dark:border-gray-600 pt-6">
                        <button type="submit" className="px-6 py-2 rounded-md bg-indigo-600 text-white font-semibold hover:bg-indigo-700">
                            Guardar Ajuste de 2FA
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
