'use client';

import { Users, ClipboardList, Shield, LogOut } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from 'next/navigation';
import { useRouter } from 'next/navigation';
import { useRole } from '@/hooks/useRole';

// Mock del servicio de logout
const logout = async () => {
    console.log("Cerrando sesión...");
    return Promise.resolve();
};

// Definir todos los items posibles con sus roles permitidos
const allSideBarItems = [
    { 
        icon: <Users/>, 
        label: 'Usuarios', 
        href: "/admin/sistema/usuarios",
        allowedRoles: ['Administrador de sistema']
    },
    { 
        icon: <ClipboardList/>, 
        label: 'Auditoría', 
        href: "/admin/sistema/auditoria",
        allowedRoles: ['Administrador de sistema', 'Auditor']
    },
    { 
        icon: <Shield />, 
        label: 'Permisos', 
        href: "/admin/proyectos/permisos",
        allowedRoles: ['Administrador de sistema','Administrador de proyectos']
    },
];

export default function Sidebar() {
    const router = useRouter();
    const pathname = usePathname();
    const { hasRole, userRole, user } = useRole(); 

    // Filtrar items según el rol del usuario
    const sideBarItems = allSideBarItems.filter(item => 
        hasRole(item.allowedRoles)
    );

    const handleLogout = async () => {
        try {
            await logout();
            router.push('/auth/login');
        } catch (error) {
            console.error("Error al cerrar sesión:", error);
        }
    };

    // Si no hay items visibles
    if (sideBarItems.length === 0) {
        return (
            <aside className="h-screen w-64 bg-white border-r border-gray-200 flex flex-col shadow-sm">
                <div className="flex items-center h-16 px-6 border-b border-gray-200">
                    <Link href="/inicio">
                         <Image
                            src="/logo.svg" 
                            alt="Gantt Flow Logo"
                            width={140}
                            height={28}
                            priority
                        />
                    </Link>
                </div>

                <div className="flex-1 flex items-center justify-center px-4">
                    <div className="text-center">
                        <p className="text-gray-500 text-sm">
                            No tienes acceso a las funciones de administración
                        </p>
                        <Link 
                            href="/inicio"
                            className="text-indigo-600 hover:text-indigo-800 text-sm mt-2 inline-block"
                        >
                            Volver al inicio
                        </Link>
                    </div>
                </div>

                <div className="p-4 border-t border-gray-200">
                    <button
                        onClick={handleLogout}
                        className="flex items-center gap-3 w-full px-4 py-2.5 rounded-lg text-left hover:bg-red-50 hover:text-red-600 transition-colors"
                    >
                        <LogOut />
                        <span className="font-medium">Salir</span>
                    </button>
                </div>
            </aside>
        );
    }

    return (
        <aside className="h-screen w-64 bg-white border-r border-gray-200 flex flex-col shadow-sm">
            {/* Header */}
            <div className="flex items-center h-16 px-6 border-b border-gray-200">
                <Link href={userRole === 'Administrador de sistema' ? "/admin/sistema/usuarios" : "/admin/sistema/auditoria"}>
                     <Image
                        src="/logo.svg" 
                        alt="Gantt Flow Logo"
                        width={140}
                        height={28}
                        priority
                    />
                </Link>
            </div>

            {/* Navegación */}
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
                                                : 'text-black hover:bg-gray-100'
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

            {/* Footer */}
            <div className="p-4 border-t border-gray-200">
                <button
                    onClick={handleLogout}
                    className="flex items-center gap-3 w-full px-4 py-2.5 rounded-lg text-left hover:bg-red-50 hover:text-red-600 transition-colors"
                >
                    <LogOut />
                    <span className="font-medium">Salir</span>
                </button>
            </div>
        </aside>
    );
}

