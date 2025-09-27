'use client';

import { House, ChartGantt, FolderKanban, LogOut } from "lucide-react";
import { usePathname } from 'next/navigation';
import { useRouter } from 'next/navigation';

const logout = async () => {
    console.log("Cerrando sesión...");
    return Promise.resolve();
};

const sideBarItems = [
    { icon: <House />, label: 'Inicio', href: "/inicio" },
    { icon: <ChartGantt />, label: 'Gantt', href: "/inicio/gantt" },
    { icon: <FolderKanban />, label: 'Proyectos', href: "/inicio/proyectos" },
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
        <aside className="h-screen w-64 bg-white border-r border-gray-200 flex flex-col shadow-sm dark:bg-gray-800 dark:border-gray-700">
            <div className="flex items-center h-16 px-6 border-b border-gray-200 dark:border-gray-700">
                <a href="/inicio">
                     <img
                        className="dark:invert"
                        src="/logo.svg" 
                        alt="Gantt Flow Logo"
                        width={140}
                        height={28}
                    />
                </a>
            </div>

            <nav className="flex-1 px-4 py-4">
                <ul className="space-y-2">
                    {sideBarItems.map(({ icon, label, href }) => {
                        const isActive = pathname === href;
                        return (
                            <li key={label}>
                                <a
                                    href={href}
                                    className={`flex items-center gap-3 px-4 py-2.5 rounded-lg transition-colors
                                        ${
                                            isActive
                                                ? 'bg-green-500 text-white shadow-sm'
                                                : 'hover:bg-gray-100 dark:hover:bg-gray-700'
                                        }`
                                    }
                                >
                                    {icon}
                                    <span className="font-medium">{label}</span>
                                </a>
                            </li>
                        );
                    })}
                </ul>
            </nav>

            <div className="p-4 border-t border-gray-200 dark:border-gray-700">
                <button
                    onClick={handleLogout}
                    className="flex items-center gap-3 w-full px-4 py-2.5 rounded-lg text-left hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-900/50 dark:hover:text-red-400 transition-colors"
                >
                    <LogOut />
                    <span className="font-medium">Salir</span>
                </button>
            </div>
        </aside>
    );
}