'use client';

import { useState, useEffect } from 'react';
import { useTheme } from 'next-themes';
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
    const { setTheme } = useTheme();
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

    // Carga los datos del usuario al montar la página
    useEffect(() => {
        const fetchFullUser = async () => {
            try {
                const authData = await getCurrentUser();
                if (authData.authenticated) {
                    const basicUser = authData.user;
                    setUser(basicUser);
                    
                    const fullUserData = await getUserById(basicUser._id);
                    
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

    // Sincroniza el tema visual cada vez que el estado 'settings.theme' cambia
    useEffect(() => {
        setTheme(settings.theme);
    }, [settings.theme, setTheme]);


    const handleSettingsChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const { name, value } = e.target;
        const processedValue = value === 'true' ? true : value === 'false' ? false : value;
        
        setSettings(prev => ({ 
            ...prev, 
            [name]: processedValue
        }));
    };

    const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setPasswordData({ ...passwordData, [e.target.name]: e.target.value });
    };

    const handleSettingsSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSettingsMessage({ text: 'Guardando...', isError: false });
        if (!user) return;
        
        try {
            const updatedUserData = await updateUser(user._id, { 
                theme: settings.theme, 
                notifications: settings.notifications,
                twoFactorEnabled: settings.twoFactorEnabled
            });

            setUser(updatedUserData); 
            const userTheme = updatedUserData.theme || 'system';
            setSettings({
                theme: userTheme,
                notifications: updatedUserData.notifications !== undefined ? updatedUserData.notifications : true,
                twoFactorEnabled: updatedUserData.twoFactorEnabled || false,
            });
            
            setSettingsMessage({ text: 'Ajustes guardados correctamente.', isError: false });
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
            setTimeout(() => setPasswordMessage({ text: '', isError: false }), 3000);

        } catch (error: any) {
            const message = error.response?.data?.message || 'Error al cambiar contraseña.';
            setPasswordMessage({ text: message, isError: true });
        }
    };

    const FormStatusMessage = ({ message }: { message: { text: string, isError: boolean }}) => {
        if (!message.text) return null;
        const textColor = message.isError ? 'text-red-600 dark:text-red-400' : 'text-green-600 dark:text-green-400';
        return <span className={`text-sm ${textColor}`}>{message.text}</span>;
    };


    if (isLoading) {
        return (
             <div className="flex-1 p-8 bg-gray-50 dark:bg-gray-900 w-full space-y-8 animate-pulse">
                <div className="h-9 bg-gray-300 dark:bg-gray-700 rounded w-1/3"></div>
                <div className="max-w-2xl mx-auto h-64 bg-gray-200 dark:bg-gray-800 rounded-lg"></div>
                <div className="max-w-2xl mx-auto h-80 bg-gray-200 dark:bg-gray-800 rounded-lg"></div>
            </div>
        );
    }

    return (
        <div className="flex-1 p-8 bg-gray-50 dark:bg-gray-900 w-full space-y-8">
            <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-100">Ajustes de Cuenta</h1>

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
                        <button type="submit" className="px-6 py-2 rounded-md bg-indigo-600 text-white font-semibold hover:bg-indigo-700 dark:bg-indigo-500 dark:hover:bg-indigo-600">
                            Cambiar Contraseña
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

