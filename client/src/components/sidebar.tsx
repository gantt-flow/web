import { Menu, House, ChartGantt, FolderKanban, Logs, LogOut } from "lucide-react"
import Link from "next/link";

const sideBarItems = [
    { icon: <House/>, label: 'Inicio', link: "/inicio" },
    { icon: <ChartGantt/>, label: 'Gantt', link: "/gantt" },
    { icon: <FolderKanban/>, label: 'Proyectos', link: "/projects" },
    { icon: <Logs/>, label: 'Logs', link: "/logs" }
];

export default function Sidebar() {
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
                    <Link href="/logout">
                        <div  className="flex items-center py-3 my-5 cursor-pointer">
                            <LogOut />
                            <span className="px-3">Salir</span>
                        </div>
                    </Link>
                </div>
            </nav>
        </aside>
    )
}