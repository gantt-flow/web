import { Users, ClipboardList, Shield, LogOut, Settings} from "lucide-react";
import Link from "next/link";

const adminSideBarItems = [
    { icon: <Users size={20} />, label: 'Usuarios', link: "/admin/usuarios" },
    { icon: <ClipboardList size={20} />, label: 'Auditoría', link: "/admin/auditoria" },
    { icon: <Shield size={20} />, label: 'Permisos', link: "/admin/permisos" },
    { icon: <Settings size={20} />, label: 'Configuración', link: "/ajustes" }
];

export default function AdminSidebar() {
    return (
        <aside className="h-full w-64 bg-gray-800 text-white">
            <div className="p-5 border-b border-gray-700">
                <h1 className="text-xl font-bold">Panel Administrador</h1>
            </div>
            
            <nav className="h-full flex flex-col justify-between" role="navigation" aria-label="Admin Sidebar">
                <ul className="flex flex-col py-4">
                    {adminSideBarItems.map(({ icon, label, link}, index) => (
                    <li key={label}>
                        <Link href={link}>
                            <div className="flex items-center py-3 px-5 hover:bg-gray-700 transition-all cursor-pointer">
                                <span className="flex items-center text-gray-300">
                                    {icon}
                                </span>   
                                <span className="px-3 font-medium">{label}</span>
                            </div>
                        </Link>
                    </li>
                    ))}
                </ul>
                
                <div className="border-t border-gray-700">
                    <Link href="/logout">
                        <div className="flex items-center py-4 px-5 hover:bg-gray-700 cursor-pointer">
                            <LogOut size={20} className="text-red-400" />
                            <span className="px-3 text-red-400 font-medium">Salir</span>
                        </div>
                    </Link>
                </div>
            </nav>
        </aside>
    )
}