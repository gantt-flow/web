'use client'; 

import Link from "next/link";
import { useRef, useState, useEffect, MutableRefObject } from "react";
import { Bell, Search, User, Settings, CircleUserRound } from 'lucide-react';
// Importamos tus servicios de notificaciones reales
import { getNotificationsByUser, updateNotificationStatus, markAllNotificationsAsRead } from "@/services/notificationsService";

// --- Definición de Tipos para TypeScript ---
// Esta interfaz debe coincidir con la que te proporcioné en la respuesta anterior
// (basada en tu servicio corregido)
interface Notification {
    _id: string;
    recipientId: string | { _id: string; name: string; email: string }; // Puede ser string o poblado
    title: string;
    message: string;
    isRead: boolean;
    createdAt: string;
    updatedAt: string;
}


// --- Hook personalizado con tipos explícitos ---
const useClickOutside = (
    ref: MutableRefObject<HTMLElement | null>, 
    handler: (event: MouseEvent | TouchEvent) => void
) => {
    useEffect(() => {
        const listener = (event: MouseEvent | TouchEvent) => {
            if (!ref.current || ref.current.contains(event.target as Node)) {
                return;
            }
            handler(event);
        };
        document.addEventListener("mousedown", listener);
        document.addEventListener("touchstart", listener);
        return () => {
            document.removeEventListener("mousedown", listener);
            document.removeEventListener("touchstart", listener);
        };
    }, [ref, handler]);
};

// --- CAMBIO PRINCIPAL AQUÍ ---
// Corregimos las rutas para que apunten dentro del layout /inicio
// y estandarizamos el tamaño del icono a 20px.
const profileDropdownItems = [
    { label: "Perfil", link: "/inicio/perfil", icon: <User size={20} /> },
    { label: "Ajustes", link: "/inicio/ajustes", icon: <Settings size={20} /> }
];
// --- FIN DEL CAMBIO ---


export default function Header() {
    const [notifications, setNotifications] = useState<Notification[]>([]);
    const [unreadCount, setUnreadCount] = useState(0);
    const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);
    const [isBellDropdownOpen, setIsBellDropdownOpen] = useState(false);

    const profileDropdownRef = useRef<HTMLDivElement>(null);
    const bellDropdownRef = useRef<HTMLDivElement>(null);

    useClickOutside(profileDropdownRef, () => setIsProfileDropdownOpen(false));
    useClickOutside(bellDropdownRef, () => setIsBellDropdownOpen(false));
    
    useEffect(() => {
        async function fetchNotifications() {
            try {
                // Esta es la llamada a tu servicio REAL. No hay datos simulados.
                const notificationsData = await getNotificationsByUser();
                setNotifications(notificationsData);
                setUnreadCount(notificationsData.filter(n => !n.isRead).length);
            } catch(err) {
                console.error("Error al obtener notificaciones:", err);
                // Si el servicio falla (ej. 404 porque no hay notificaciones), nos aseguramos de que los estados queden limpios.
                setNotifications([]);
                setUnreadCount(0);
            }
        }
        fetchNotifications();
    }, []);

    const handleUpdateNotificationStatus = async (notification: Notification) => {
        if (notification.isRead) return;
        try {
            // Llamada al servicio REAL
            await updateNotificationStatus(notification._id);
            const updatedNotifications = notifications.map(n => 
                n._id === notification._id ? { ...n, isRead: true } : n
            );
            setNotifications(updatedNotifications);
            setUnreadCount(updatedNotifications.filter(n => !n.isRead).length);
        } catch (error) {
            console.error("Failed to update notification status", error);
        }
    };

    const handleMarkAllAsRead = async () => {
        if (unreadCount === 0) return; 

        try {
            // Llamada al servicio REAL
            await markAllNotificationsAsRead();
            
            const allRead = notifications.map(n => ({ ...n, isRead: true }));
            setNotifications(allRead);
            setUnreadCount(0);

        } catch (error) {
            console.error("Falló al marcar todas como leídas", error);
        }
    };

    return (
        <header className="grid grid-cols-3 items-center w-full h-16 px-6 bg-white border-b border-gray-200 relative z-30">
            {/* Columna Izquierda (Vacía para empujar el centro) */}
            <div></div>

            {/* Columna Central (Barra de Búsqueda) */}
            <div className="flex justify-center">
                <div className="relative w-full max-w-lg">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                    <input
                        type="search"
                        placeholder="Buscar proyectos, tareas..."
                        className="w-full h-10 pl-10 pr-4 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-shadow"
                        autoComplete="off"
                    />
                </div>
            </div>

            {/* Columna Derecha (Iconos de Usuario y Notificaciones) */}
            <div className="flex justify-end items-center gap-5">
                <div ref={bellDropdownRef} className="relative">
                    <button onClick={() => { setIsBellDropdownOpen(!isBellDropdownOpen); setIsProfileDropdownOpen(false); }} className="relative hover:text-green-500 transition-colors">
                        <Bell size={28} />
                        {unreadCount > 0 && (
                            <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-xs text-white">
                                {unreadCount}
                            </span>
                        )}
                    </button>
                    {isBellDropdownOpen && (
                        <div className="absolute right-0 mt-3 w-80 bg-white rounded-lg shadow-xl border z-50">
                            <div className="p-4 font-semibold border-b flex justify-between items-center">
                                <span>Notificaciones</span>
                                {unreadCount > 0 && (
                                    <button
                                        onClick={handleMarkAllAsRead}
                                        className="text-sm font-normal text-blue-600 hover:text-blue-800 hover:underline focus:outline-none"
                                    >
                                        Marcar todas como leídas
                                    </button>
                                )}
                            </div>
                            <ul className="py-2 max-h-80 overflow-y-auto">
                                {notifications.length > 0 ? notifications.map(notification => (
                                    <li key={notification._id} className={`px-4 py-2 cursor-pointer transition-colors ${!notification.isRead ? 'bg-blue-50' : 'bg-white'} hover:bg-gray-100`} onClick={() => handleUpdateNotificationStatus(notification)}>
                                        <p className={`font-semibold text-sm ${!notification.isRead ? 'text-gray-800' : 'text-gray-600'}`}>{notification.title}</p>
                                        <p className="text-xs text-gray-500">{notification.message}</p>
                                    </li>
                                )) : <li className="px-4 py-8 text-center text-sm text-gray-500">No tienes notificaciones</li>}
                            </ul>
                        </div>
                    )}
                </div>

                <div ref={profileDropdownRef} className="relative">
                    <button onClick={() => { setIsProfileDropdownOpen(!isProfileDropdownOpen); setIsBellDropdownOpen(false); }} className="hover:text-green-500 transition-colors">
                         <CircleUserRound size={30} />
                    </button>
                    {isProfileDropdownOpen && (
                        <div className="absolute right-0 mt-3 w-48 bg-white rounded-lg shadow-xl border z-50">
                            <ul className="py-2 text-sm text-gray-700">
                                {profileDropdownItems.map(({ label, link, icon }) => (
                                    <li key={label}>
                                        <Link href={link} className="flex items-center gap-3 px-4 py-2 hover:bg-gray-100">
                                            {/* Contenedor para asegurar alineación y tamaño de icono */}
                                            <div className="w-[20px] h-[20px] flex items-center justify-center">
                                                {icon}
                                            </div>
                                            <span>{label}</span>
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}
                </div>
            </div>
        </header>
    );
}