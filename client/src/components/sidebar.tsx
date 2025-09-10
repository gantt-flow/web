'use client';

import { House, ChartGantt, FolderKanban, Logs, LogOut } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from 'next/navigation';
import { useRouter } from 'next/navigation';

// Mock del servicio de logout para que el componente sea funcional
const logout = async () => {
    console.log("Cerrando sesión...");
    return Promise.resolve();
};

const sideBarItems = [
    { icon: <House />, label: 'Inicio', href: "/inicio" },
    { icon: <ChartGantt />, label: 'Gantt', href: "/inicio/gantt" },
    { icon: <FolderKanban />, label: 'Proyectos', href: "/inicio/proyectos" },
    { icon: <Logs />, label: 'Logs', href: "/inicio/logs" }
];

export default function Sidebar() {
    const router = useRouter();
    const pathname = usePathname();

    const handleLogout = async () => {
        try {
            await logout();
            router.push('/auth/login');
        } catch (error) {
            console.error("Error al cerrar sesión:", error);
        }
    };

    return (
        <aside className="h-screen w-64 bg-white border-r border-gray-200 flex flex-col shadow-sm">
            {/* CONTENEDOR DEL LOGO ALINEADO */}
            {/* Se cambia p-6 por h-16 para igualar la altura del header (64px) */}
            {/* Se añade flex e items-center para centrar verticalmente el logo */}
            {/* Se usa px-6 para mantener el padding horizontal */}
            <div className="flex items-center h-16 px-6 border-b border-gray-200">
                <Link href="/inicio">
                     <Image
                        src="/logo.svg" 
                        alt="Gantt Flow Logo"
                        width={140}
                        height={28} // Se corrige la altura para mantener la proporción
                        priority
                    />
                </Link>
            </div>

            <nav className="flex-1 px-4 py-4">
                <ul className="space-y-2">
                    {sideBarItems.map(({ icon, label, href }) => {
                        const isActive = pathname === href;
                        return (
                            <li key={label}>
                                <Link
                                    href={href}
                                    className={`flex items-center gap-3 px-4 py-2.5 rounded-lg transition-colors
                                        ${
                                            isActive
                                                ? 'bg-green-500 text-white shadow-sm'
                                                : 'hover:bg-gray-100'
                                        }`
                                    }
                                >
                                    {icon}
                                    <span className="font-medium">{label}</span>
                                </Link>
                            </li>
                        );
                    })}
                </ul>
            </nav>

            <div className="p-4 border-t border-gray-200">
                <button
                    onClick={handleLogout}
                    className="flex items-center gap-3 w-full px-4 py-2.5 rounded-lg text-left  hover:bg-red-50 hover:text-red-600 transition-colors"
                >
                    <LogOut />
                    <span className="font-medium">Salir</span>
                </button>
            </div>
        </aside>
    );
}
