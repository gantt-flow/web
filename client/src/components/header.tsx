'use client'; 

import Image from "next/image";
import Link from "next/link";
import { useRef, useState, useEffect } from "react";
import { getNotificationsByUser, Notification, updateNotificationStatus } from "@/services/notificationsService";

const profileDropdownItems = [
    {label: "Perfil", link: "/perfil"},
    {label: "Ajustes", link: "/ajustes"}
];

export default function Header() {

    const [notifications, setNotifications] = useState<Notification[]>([]);
    const inputRef = useRef<HTMLInputElement>(null);
    const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);
    const [isBellDropdownOpen, setIsBellProfileDropdownOpen] = useState(false);

    const clearInput = () => {
        if (inputRef.current) {
        inputRef.current.value = "";
        inputRef.current.focus(); // opcional: vuelve a enfocar el input
        }
    };

    const profileToggleDropdown = () => {
      setIsProfileDropdownOpen(!isProfileDropdownOpen);  
      setIsBellProfileDropdownOpen(false);
    };

    const bellToggleDropdown = () => {
        setIsBellProfileDropdownOpen(!isBellDropdownOpen);
        setIsProfileDropdownOpen(false);
    }

    useEffect(() => {
        
        async function fetchNotifications() {
            
            try {
                const notifications = await getNotificationsByUser();
                setNotifications(notifications);
            } catch(err) {
                console.error("Erro al obtener notificaciones")
            }
        }
        
        fetchNotifications();
    }, []);

    const handleUpdateNotificationStatus = async (notificationId: string) => {

        if (typeof notificationId !== 'string' || !notificationId) return;

        const updatedNotification = await updateNotificationStatus(notificationId);
        // Actualiza el estado local para reflejar el cambio inmediatamente
        setNotifications(notifications.map(n =>
            n._id === notificationId ? { ...n, isRead: updatedNotification.isRead } : n
        ));
    
    }


    return(
        <div className="flex flex-col">
            <div className="flex flex-row border-b border-gray-300">
                <div className="flex w-full justify-between m-3">
                    <div className="flex ml-2">
                        <Link href="/inicio">
                            <Image
                            className="dark:invert border"
                            src="/logo.svg"
                            alt="Gantt Logo"
                            width={150}
                            height={30}
                            priority
                            />
                        </Link>
                    </div>

                    <div className="w-128 flex-initial border border-gray-300 rounded-lg">
                        <form action="/search" method="get" role="search" className="relative h-full">
                                <button type="submit" className="absolute inset-y-0 start-0 bottom-1 items-center ps-3 cursor-pointer">
                                    <span>
                                        <i>
                                            <Image src="/magnifierIcon.svg" alt="Magnigier Icon" width={18} height={18} />
                                        </i>
                                    </span>
                                </button>
                
                                <input
                                    className="block w-full h-full ps-10 rounded-lg"
                                    type="search"
                                    id="site-search"
                                    name="q"
                                    placeholder="Buscar..."
                                    aria-label="Ingresa tu búsqueda"
                                    ref={inputRef}
                                    autoComplete="off"
                                />

                                <button type="button" onClick={clearInput} className="absolute end-3.5 bottom-3 cursor-pointer" aria-label="Limpiar búsqueda">
                                    <i>
                                        <Image src="/cancelIcon.svg" alt="Magnigier Icon" width={18} height={18} />
                                    </i>
                                </button>
                        </form>
                    </div>

                    <div className="flex gap-5">

                        <button onClick={bellToggleDropdown} className="relative cursor-pointer" type="button">
                            <Image
                                className="dark:invert"
                                src="/bell.svg"
                                alt="Bell Icon"
                                width={40}
                                height={40}
                                priority
                            /> 

                            {/* Bell dropdown */}
                            { isBellDropdownOpen && (
                                <div className="bg-white absolute mt-2 z-10 right-0 rounded-lg shadow-sm w-128 dark:bg-gray-700">
                                    <div className="mt-4">
                                        Notificaciones
                                    </div>
                                    
                                    <ul className="py-2 ml-2 mr-2 text-gray-700 dark:text-gray-200 text-left">
                                        {notifications.map( notification => (
                                            <li
                                                key={notification._id} 
                                                className={`p-3 rounded-md cursor-pointer transition-colors ${
                                                    !notification.isRead
                                                    ?'bg-green-100 hover:bg-green-200 dark:bg-green-900/50'
                                                    :'hover:bg-gray-100 dark:hover:bg-gray-600'
                                                }`}
                                                onClick={ () => handleUpdateNotificationStatus(notification._id)}>
                                                <div className="flex flex-col">
                                                    <strong className="font-semibold text-gray-900 dark:text-white">
                                                        {notification.title}
                                                    </strong>
                                                    <p className="text-gray-600 dark:text-gray-300 mt-1">
                                                        {notification.message}
                                                    </p>
                                                </div>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            )}
                        </button>

                        <button onClick={profileToggleDropdown} className="relative cursor-pointer" type="button">
                            <Image
                            className="dark:invert"
                            src="/defaultUserPicture.svg"
                            alt="Default User Picture Icon"
                            width={40}
                            height={40}
                            priority
                            />

                            {/* Dropdown menu*/}
                            {isProfileDropdownOpen && (
                                <div className="bg-white absolute mt-2 z-10 right-0 rounded-lg shadow-sm w-32 dark:bg-gray-700">
                                    <ul className="py-2 text-sm text-gray-700 dark:text-gray-200" aria-labelledby="dropdownDefaultButton">
                                        {profileDropdownItems.map(({ label, link }, index) => (
                                            <li key={label}>
                                                <Link href={link} className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white">
                                                    {label}
                                                </Link>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            )}
                        </button>
                    </div>

                    
                </div> 
            </div>
        </div>
    )
}