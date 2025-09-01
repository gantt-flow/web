'use client';

import { Users, ClipboardList, Shield, LogOut, Settings } from "lucide-react"
import Link from "next/link";
import { useRouter } from 'next/navigation';
import { logout } from '@/services/authService';

const sideBarItems = [
    { icon: <Users size={20} />, label: 'Usuarios', link: "/admin/sistema/usuarios" },
    { icon: <ClipboardList size={20} />, label: 'Auditoría', link: "/admin/sistema/auditoria" },
    { icon: <Shield size={20} />, label: 'Permisos', link: "/admin/proyectos/permisos" },
    //{ icon: <Settings size={20} />, label: 'Configuración', link: "/ajustes" }
];

export default function Sidebar() {
    const router = useRouter();

    const handleLogout = async () => {
        try {
            await logout(); // Llama al servicio que llama al backend
            router.push('/auth/login'); // Redirige al usuario a la página de login
            setTimeout(() => {
                window.location.reload();
            }, 100);
        } catch (error) {
            console.error("Error al cerrar sesión:", error);
            // Opcional: mostrar un mensaje de error al usuario
            router.push('/auth/login');
        }
    };


    return (
        <aside className="h-full w-48">
            <nav className="h-full flex flex-col" role="navigation" aria-label="Sidebar">
                    <ul className="flex flex-1 flex-col px-5">
                        {sideBarItems.map(({ icon, label, link}, index) => (
                        <li key={label}>
                            <Link href={link}>
                                <div className="flex items-center py-3 my-5 cursor-pointer">
                                    {icon}   
                                    <span className="px-3">{label}</span>
                                </div>
                            </Link>
                        </li>
                        ))}
                    </ul>
                

                <div className="flex px-5">
                     <button onClick={handleLogout} className="flex items-center cursor-pointer py-3 my-5 w-full text-left hover:bg-gray-100 rounded-md">
                        <LogOut />
                        <span className="px-3">Salir</span>
                    </button>
                </div>
            </nav>
        </aside>
    )
}