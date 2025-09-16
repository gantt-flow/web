'use client';

import { useState, useEffect, useMemo } from 'react';
import { getCurrentUser, AuthenticatedUser } from '@/services/userService';
import { getUserProjects, Projects } from '@/services/projectService';
import { getTasksByProject, Task } from '@/services/taskService'; 
import { 
    LayoutGrid, 
    ClipboardCheck, 
    AlertCircle, 
    CheckCircle, 
    TrendingUp,
    Calendar,
    ChevronDown
} from 'lucide-react';
import Link from 'next/link';

// Tipo para el usuario actual (basado en tu servicio)
type CurrentUser = AuthenticatedUser['user'] | null;

//--- 1. COMPONENTE DE CALENDARIO LIGERO (NUEVO) ---
const DashboardCalendar = ({ tasks }: { tasks: Task[] }) => {
    const [date, setDate] = useState(new Date());

    const taskDueDates = useMemo(() => {
        const dates = new Set<string>();
        tasks.forEach(task => {
            const dueDate = new Date(task.dueDate);
            if (dueDate.getFullYear() === date.getFullYear() && dueDate.getMonth() === date.getMonth()) {
                dates.add(dueDate.toISOString().split('T')[0]); 
            }
        });
        return dates;
    }, [tasks, date]);

    const todayStr = new Date().toISOString().split('T')[0];

    const renderHeader = () => (
        <div className="flex justify-between items-center mb-4">
            <button 
                onClick={() => setDate(new Date(date.setMonth(date.getMonth() - 1)))}
                className="p-1 rounded-md hover:bg-gray-100"
            >
                &lt;
            </button>
            <div className="text-lg font-semibold text-gray-900">
                {date.toLocaleString('es-ES', { month: 'long', year: 'numeric' })}
            </div>
            <button 
                onClick={() => setDate(new Date(date.setMonth(date.getMonth() + 1)))}
                className="p-1 rounded-md hover:bg-gray-100"
            >
                &gt;
            </button>
        </div>
    );

    const renderDaysOfWeek = () => {
        const days = ['D', 'L', 'M', 'M', 'J', 'V', 'S'];
        return (
            <div className="grid grid-cols-7 gap-1 text-center text-xs font-semibold text-gray-500">
                {/* --- CORRECCIÓN: Se añade el 'index' al key para hacerlo único (ej: "M-2" y "M-3") --- */}
                {days.map((day, index) => (
                    <div key={`${day}-${index}`} className="w-10 h-10 flex items-center justify-center">{day}</div>
                ))}
            </div>
        );
    };

    const renderCells = () => {
        const monthStart = new Date(date.getFullYear(), date.getMonth(), 1);
        const monthEnd = new Date(date.getFullYear(), date.getMonth() + 1, 0);
        const startDate = new Date(monthStart);
        startDate.setDate(startDate.getDate() - monthStart.getDay()); 

        const cells = [];
        let day = new Date(startDate);

        for (let i = 0; i < 42; i++) { 
            const dayStr = day.toISOString().split('T')[0];
            const isToday = dayStr === todayStr;
            const isCurrentMonth = day.getMonth() === date.getMonth();
            const hasDueDate = taskDueDates.has(dayStr);

            let cellClasses = "w-10 h-10 flex items-center justify-center rounded-full text-sm transition-colors ";
            if (!isCurrentMonth) {
                cellClasses += "text-gray-300";
            } else if (isToday) {
                cellClasses += "bg-indigo-600 text-white font-bold";
            } else if (hasDueDate) {
                cellClasses += "bg-indigo-100 text-indigo-700 font-semibold";
            } else {
                cellClasses += "text-gray-700 hover:bg-gray-100";
            }

            cells.push(
                <div key={dayStr} className={cellClasses}>
                    {day.getDate()}
                </div>
            );
            day.setDate(day.getDate() + 1);
        }
        return <div className="grid grid-cols-7 gap-1 text-center">{cells}</div>;
    };

    return (
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            {renderHeader()}
            {renderDaysOfWeek()}
            {renderCells()}
        </div>
    );
};


//--- 2. COMPONENTE DE GRÁFICO LIGERO ---
const SimpleBarChart = ({ data }: { data: { name: string; value: number, color: string }[] }) => {
    const maxValue = Math.max(...data.map(d => d.value), 1); 
    return (
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Tareas por Estado</h2>
            <div className="space-y-4">
                {data.map(item => (
                    <div key={item.name}>
                        <div className="flex justify-between mb-1 text-sm font-medium text-gray-600">
                            <span>{item.name}</span>
                            <span>{item.value}</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2.5">
                            <div 
                                className={`${item.color} h-2.5 rounded-full`} 
                                style={{ width: `${(item.value / maxValue) * 100}%` }}
                            ></div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};


//--- 3. COMPONENTE PRINCIPAL DEL DASHBOARD ---
export default function HomePage() {
    const [user, setUser] = useState<CurrentUser>(null);
    const [projects, setProjects] = useState<Projects[]>([]);
    const [isLoadingPage, setIsLoadingPage] = useState(true); 
    
    const [selectedProjectId, setSelectedProjectId] = useState<string>(''); 
    const [projectTasks, setProjectTasks] = useState<Task[]>([]); 
    const [isWidgetLoading, setIsWidgetLoading] = useState(false); 


    // Efecto 1: Cargar usuario y lista de proyectos (solo una vez)
    useEffect(() => {
        const fetchUserAndProjects = async () => {
            setIsLoadingPage(true);
            try {
                const authData = await getCurrentUser();
                if (authData.authenticated && authData.user) {
                    const currentUser = authData.user;
                    setUser(currentUser);
                    
                    const userProjects = await getUserProjects(currentUser._id);
                    setProjects(userProjects);

                    if (userProjects.length > 0) {
                        setSelectedProjectId(userProjects[0]._id);
                    }
                } else {
                    setUser(null);
                    setProjects([]);
                }
            } catch(error) {
                console.error("Error fetching homepage data:", error);
            } finally {
                setIsLoadingPage(false); 
            }
        };
        fetchUserAndProjects();
    }, []); 

    // Efecto 2: Cargar tareas CADA VEZ que selectedProjectId cambie
    useEffect(() => {
        const fetchTasks = async () => {
            if (!selectedProjectId) return; 

            setIsWidgetLoading(true);
            try {
                const tasks = await getTasksByProject(selectedProjectId);
                setProjectTasks(tasks);
            } catch (error) {
                console.error("Error fetching tasks for project:", error);
                setProjectTasks([]); 
            } finally {
                setIsWidgetLoading(false);
            }
        };

        fetchTasks();
    }, [selectedProjectId]); 


    // Cálculo de KPIs
    const projectStats = useMemo(() => {
        const totalTasks = projectTasks.length;
        const completedTasks = projectTasks.filter(t => t.status === 'Completada').length;
        const overdueTasks = projectTasks.filter(t => 
            new Date(t.dueDate) < new Date() && t.status !== 'Completada'
        ).length;
        const completionPercent = totalTasks === 0 ? 0 : Math.round((completedTasks / totalTasks) * 100);

        return { totalTasks, completedTasks, overdueTasks, completionPercent };
    }, [projectTasks]);

    // Datos del Gráfico
    const chartData = useMemo(() => {
        const statusCounts = {
            'Sin iniciar': 0,
            'En progreso': 0,
            'Completada': 0,
            'En espera': 0,
        };
        projectTasks.forEach(task => {
            if (task.status in statusCounts) {
                statusCounts[task.status as keyof typeof statusCounts]++;
            }
        });

        return [
            { name: 'Sin iniciar', value: statusCounts['Sin iniciar'], color: 'bg-gray-400' },
            { name: 'En progreso', value: statusCounts['En progreso'], color: 'bg-blue-500' },
            { name: 'Completada', value: statusCounts['Completada'], color: 'bg-green-500' },
            { name: 'En espera', value: statusCounts['En espera'], color: 'bg-yellow-500' },
        ];
    }, [projectTasks]);


    // Estado de carga principal
    if (isLoadingPage) {
         return (
            <div className="flex-1 p-8 bg-gray-50 animate-pulse w-full">
                <div className="h-8 bg-gray-300 rounded w-1/3 mb-4"></div>
                <div className="h-10 bg-gray-300 rounded w-1/2 mb-8"></div>
                <div className="h-96 bg-gray-200 rounded-lg"></div>
            </div>
        )
    }

    return (
        <div className="flex-1 p-8 bg-gray-50 w-full min-h-full">
            {/* Header del Dashboard */}
            <div className="flex flex-col sm:flex-row justify-between sm:items-center mb-6 gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-gray-800">
                        Bienvenido, {user?.name || 'Invitado'}
                    </h1>
                    <p className="text-gray-600">Este es el resumen de tu proyecto seleccionado.</p>
                </div>
                {/* Selector de Proyecto */}
                <div className="relative">
                    <select
                        value={selectedProjectId}
                        onChange={(e) => setSelectedProjectId(e.target.value)}
                        className="appearance-none w-full sm:w-72 block pl-4 pr-10 py-3 text-base border border-gray-300 rounded-lg bg-white focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 font-medium"
                    >
                        {projects.length === 0 && <option>No tienes proyectos</option>}
                        {projects.map(project => (
                            <option key={project._id} value={project._id}>
                                {project.name}
                            </option>
                        ))}
                    </select>
                     <ChevronDown className="w-5 h-5 text-gray-400 absolute right-3 top-3.5 pointer-events-none" />
                </div>
            </div>

            {/* Widgets de KPI */}
            {isWidgetLoading ? (
                 <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 animate-pulse">
                    <div className="h-28 bg-gray-200 rounded-lg"></div>
                    <div className="h-28 bg-gray-200 rounded-lg"></div>
                    <div className="h-28 bg-gray-200 rounded-lg"></div>
                    <div className="h-28 bg-gray-200 rounded-lg"></div>
                 </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    <KpiCard icon={<LayoutGrid size={24} className="text-blue-600" />} title="Total de Tareas" value={projectStats.totalTasks} />
                    <KpiCard icon={<CheckCircle size={24} className="text-green-600" />} title="Completadas" value={projectStats.completedTasks} />
                    <KpiCard icon={<AlertCircle size={24} className="text-red-600" />} title="Atrasadas" value={projectStats.overdueTasks} />
                    <KpiCard icon={<TrendingUp size={24} className="text-indigo-600" />} title="Progreso" value={`${projectStats.completionPercent}%`} />
                </div>
            )}
            

            {/* Gráficos y Calendario */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6">
                <div className="lg:col-span-2">
                     {isWidgetLoading ? (
                        <div className="h-96 bg-gray-200 rounded-lg animate-pulse"></div>
                     ) : (
                        <SimpleBarChart data={chartData} />
                     )}
                </div>
                <div className="lg:col-span-1">
                     {isWidgetLoading ? (
                        <div className="h-96 bg-gray-200 rounded-lg animate-pulse"></div>
                     ) : (
                        <DashboardCalendar tasks={projectTasks} />
                     )}
                </div>
            </div>
        </div>
    );
}

// Componente de Tarjeta KPI (Helper)
const KpiCard = ({ icon, title, value }: { icon: React.ReactNode, title: string, value: string | number }) => (
    <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
        <div className="flex items-center space-x-4">
            <div className="p-3 rounded-full bg-gray-100">
                {icon}
            </div>
            <div>
                <div className="text-sm font-medium text-gray-500">{title}</div>
                <div className="text-3xl font-bold text-gray-900">{value}</div>
            </div>
        </div>
    </div>
);