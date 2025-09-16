'use client';

import { useEffect, useState, useMemo } from "react"; 
import { useRouter } from 'next/navigation';
import { Projects, getUserProjects, getTeamMembers } from "@/services/projectService"; // <-- IMPORTAMOS getTeamMembers
import { AuthenticatedUser, getCurrentUser } from '@/services/userService'; 
import { getTasksByProject, updatedTask } from "@/services/taskService"; 
import { Task, NewTask, createTask } from "@/services/taskService";
import GanttToolBar from "@/components/gantt/ganttToolBar";
import GanttTaskListPanel from "@/components/gantt/ganttTaskListPanel";
import TimelinePanel from "@/components/gantt/timelinePanel";
import AddTaskModal from "@/components/gantt/addTaskModal";
import TaskCommentsModal from "@/components/gantt/tasksCommentsModal";
import FilterModal, { ActiveFilters } from "@/components/gantt/filterPanel";
import { Users, Plus } from "lucide-react"; // <-- IMPORTAMOS el icono Users

export type ViewMode = 'Día' | 'Semana' | 'Mes';

type CurrentUser = AuthenticatedUser['user'];
type Assignee = { _id: string; name: string };

export default function Gantt(){

    const [projects, setProjects] = useState<Projects[]>([]);
    const [selectedProject, setSelectedProject] = useState<string>('');
    
    const [currentUser, setCurrentUser] = useState<CurrentUser | null>(null);
    const [allTasks, setAllTasks] = useState<Task[]>([]); 

    // --- CAMBIO: 'projectMembers' ahora es un estado real, no un 'useMemo' derivado ---
    // Esto es crucial para saber si el proyecto tiene miembros ANTES de que tenga tareas.
    const [projectMembers, setProjectMembers] = useState<Assignee[]>([]);
    const [isLoadingProjectData, setIsLoadingProjectData] = useState(true); // Nuevo estado de carga para los paneles

    const [isAddTaskModalOpen, setIsAddTaskModalOpen] = useState(false);
    const [selectedTaskForComments, setSelectedTaskForComments] = useState<Task | null>(null);
    const [viewMode, setViewMode] = useState<ViewMode>('Día');
    const router = useRouter();

    const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);
    const [activeFilters, setActiveFilters] = useState<ActiveFilters>({
        status: 'all',
        assignee: 'all',
        time: 'all',
        dateRange: { start: '', end: '' },
        priority: 'all',
    });

    // 1. Obtener el usuario actual (Sin cambios)
    useEffect(() => {
        async function fetchCurrentUser() {
            try {
                const authData = await getCurrentUser(); 
                if (authData.authenticated) {
                    setCurrentUser(authData.user); 
                }
            } catch(err) {
                console.error("Error fetching current user:", err);
            }
        }
        fetchCurrentUser();
    }, []); 


    // 2. Obtener proyectos (Sin cambios)
    useEffect(() => {
        async function fetchProjects() {
            if (currentUser && currentUser._id) { 
                try {
                    const userProjects = await getUserProjects(currentUser._id); 
                    setProjects(userProjects);
                    if (userProjects.length > 0) {
                        setSelectedProject(userProjects[0]._id);
                    }
                } catch(err) {
                    console.error("Error al obtener proyectos:", err);
                    setProjects([]);
                }
            }
        } 
        fetchProjects();
    },[currentUser]); 

    const handleProjectChange = (e: React.ChangeEvent< HTMLSelectElement>) => {
        const value = e.target.value;
        setSelectedProject(value);
    }

    // --- CAMBIO: useEffect[selectedProject] ahora carga TAREAS y MIEMBROS ---
    // 3. Obtener tareas Y miembros cuando cambie el proyecto
    useEffect(() => {
        async function fetchProjectData() {
            if (!selectedProject) {
                 setIsLoadingProjectData(false);
                 return;
            };

            setIsLoadingProjectData(true); // Mostrar carga para los paneles
            try {
                // Hacemos ambas llamadas en paralelo para velocidad
                const [tasks, members] = await Promise.all([
                    getTasksByProject(selectedProject),
                    getTeamMembers(selectedProject) // <-- Usamos el servicio real de miembros
                ]);
                
                setAllTasks(tasks || []); // Aseguramos que sea un array si la respuesta es nula/errónea
                setProjectMembers(members || []); // ESTADO CLAVE: Ahora sabemos si hay miembros

            } catch (error) {
                console.error("Error al cargar datos del proyecto:", error);
                setAllTasks([]); 
                setProjectMembers([]); // Importante resetear en caso de error
            } finally {
                setIsLoadingProjectData(false);
            }
        }
        fetchProjectData();
    },[selectedProject]); // Se ejecuta cada vez que el proyecto cambia


    // --- ELIMINADO: El 'useMemo' para projectMembers ya no es necesario ---
    // const projectMembers = useMemo(() => { ... }); // ESTO FUE ELIMINADO


    // 5. Lógica de filtrado (Sin cambios, funciona como antes)
    const filteredTasks = useMemo(() => {
        // ... (Tu lógica de filtrado de useMemo sigue aquí, sin cambios) ...
        // ...
        const now = new Date();
        const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());
        const todayEnd = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59, 59);
        const dayOfWeek = todayStart.getDay();
        const startOfWeek = new Date(todayStart.getTime() - dayOfWeek * 24 * 60 * 60 * 1000);
        const endOfWeek = new Date(startOfWeek.getTime() + 6 * 24 * 60 * 60 * 1000);
        endOfWeek.setHours(23, 59, 59);

        return allTasks.filter(task => {
            if (activeFilters.status !== 'all') {
                if (activeFilters.status === 'open' && task.status === 'Completada') return false;
                if (activeFilters.status === 'closed' && task.status !== 'Completada') return false;
                if (!['all', 'open', 'closed'].includes(activeFilters.status) && task.status !== activeFilters.status) return false;
            }
            if (activeFilters.assignee !== 'all' && currentUser) {
                const assignees: Assignee[] = Array.isArray(task.assignedTo)
                    ? (task.assignedTo as Assignee[])
                    : task.assignedTo
                        ? [task.assignedTo as Assignee]
                        : [];
                if (activeFilters.assignee === 'me') {
                    if (!assignees.some(user => user._id === currentUser._id)) return false;
                } else {
                    if (!assignees.some(user => user._id === activeFilters.assignee)) return false;
                }
            }
            const taskDueDate = new Date(task.dueDate);
            if (activeFilters.time !== 'all') {
                if (activeFilters.time === 'overdue' && (taskDueDate >= todayStart || task.status === 'Completada')) return false;
                if (activeFilters.time === 'today' && (taskDueDate < todayStart || taskDueDate > todayEnd)) return false;
                if (activeFilters.time === 'week' && (taskDueDate < startOfWeek || taskDueDate > endOfWeek)) return false;
            }
            if (activeFilters.dateRange.start) {
                 if (taskDueDate < new Date(activeFilters.dateRange.start)) return false;
            }
             if (activeFilters.dateRange.end) {
                const endDateRange = new Date(activeFilters.dateRange.end);
                endDateRange.setHours(23, 59, 59);
                if (taskDueDate > endDateRange) return false;
            }
            if (activeFilters.priority !== 'all' && task.priority !== activeFilters.priority) return false;
            return true; 
        });
    }, [allTasks, activeFilters, currentUser]);

    
    const handleViewModeChange = (mode: ViewMode) => {
        setViewMode(mode);
    };

    const handleAddTask = async (newTask: NewTask) => {
        try {
            await createTask(newTask); 
            if (selectedProject) {
                const updatedTasks = await getTasksByProject(selectedProject);
                setAllTasks(updatedTasks);
            }

        } catch(error) {
            console.error("Error al crear la tarea:", error); // <-- Mejorado el mensaje de error
        }
        setIsAddTaskModalOpen(false);
    };

    const handleGoToToday = () => {
        const event = new CustomEvent('scrollToToday');
        window.dispatchEvent(event);
    };

    const handleSettingsClick = () => {
        if (selectedProject) {
            router.push(`/inicio/proyectos/${selectedProject}`);
        }
    };

    // --- CAMBIO: Lógica de protección en el handler del botón ---
    // Prevenimos que el modal se abra si no hay miembros, evitando el error 400.
    const handleToolbarAddTaskClick = () => {
        if (projectMembers.length === 0) {
            alert("No se pueden agregar tareas. Por favor, agrega miembros al proyecto primero.");
            // Opcional: navegarlo directamente a la página de ajustes
            // handleSettingsClick(); 
            return;
        }
        setIsAddTaskModalOpen(true);
    };
    // --- FIN DEL CAMBIO ---


    const handleUpdateTask = async (taskId: string, updatedTaskData: Task) => {
        // ... (Sin cambios)
        try {
            await updatedTask(taskId, updatedTaskData);
            setAllTasks(currentTasks => 
                currentTasks.map(task => 
                    task._id === taskId ? updatedTaskData : task
                )
            );
        } catch (error) {
            console.error("Error al actualizar la tarea:", error);
        }
    };

     const handleTaskStatusChange = async (taskId: string) => {
        // ... (Sin cambios)
        const taskToUpdate = allTasks.find(t => t._id === taskId); 
        if (!taskToUpdate) {
            console.error("No se encontró la tarea para actualizar.");
            return;
        }
        const statusCycle = ['Sin iniciar', 'En progreso', 'Completada', 'En espera'];
        const currentStatusIndex = statusCycle.indexOf(taskToUpdate.status);
        const nextStatus = statusCycle[(currentStatusIndex + 1) % statusCycle.length];
        const taskPayload = { ...taskToUpdate, status: nextStatus };
        try {
            const updatedTaskFromServer = await updatedTask(taskId, taskPayload);
            setAllTasks(prevTasks =>
                prevTasks.map(task =>
                    task._id === taskId ? updatedTaskFromServer : task
                )
            );
        } catch (error) {
            console.error("Error al actualizar el estado de la tarea:", error);
        }
    };

    const handleTaskClickInTimeline = (task: Task) => {
        setSelectedTaskForComments(task);
    };

    // --- CAMBIO: Componente de Estado Vacío ---
    const NoMembersEmptyState = () => (
        <div className="flex flex-col items-center justify-center w-full p-10 bg-white text-center border-t border-gray-200" style={{ height: 'calc(100vh - 14rem)' /* Ajustar altura */ }}>
             <Users className="w-16 h-16 text-gray-400 mb-4" />
             <h2 className="text-xl font-semibold text-gray-800">Este proyecto no tiene miembros</h2>
             <p className="text-gray-500 max-w-md mt-2 mb-6">
                Para poder crear y asignar tareas, primero debes invitar personas a tu proyecto.
             </p>
             <button 
                onClick={handleSettingsClick} // Reutiliza tu handler existente
                className="flex items-center gap-2 px-6 py-2 rounded-md bg-indigo-600 text-white font-semibold hover:bg-indigo-700 transition-colors"
             >
                <Plus size={18} />
                Agregar Personas al Proyecto
             </button>
        </div>
    );

    return(
        // Contenedor principal: Quitamos overflow-y del padre
        <div className="flex flex-col p-4 pb-0 h-full"> 

            {/* --- ÁREA SUPERIOR FIJA (Sin cambios) --- */}
            <div className="flex-shrink-0">
                <div className="h-12">
                    { projects && projects.length > 0 && (
                        <select 
                            name="project"
                            value={selectedProject}
                            onChange={handleProjectChange}
                            className="rounded block w-1/2 max-w-md px-4 py-3 pr-8 bg-white border border-solid border-gray-300 transition ease-in-out m-0 focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none" required 
                        >
                            {projects.map( project => (
                                <option key={project._id} value={project._id}>{project.name}</option>
                            ))}
                        </select>
                    )}
                </div>
                <div className="h-12 mt-4">
                    <GanttToolBar
                        viewMode={viewMode}
                        onViewModeChange={handleViewModeChange}
                        onAddTaskClick={handleToolbarAddTaskClick} // <-- CAMBIO: Usamos el handler protegido
                        onFilterClick={() => setIsFilterModalOpen(true)} 
                        onGoToToday={handleGoToToday}
                        onSettingsClick={handleSettingsClick}
                    />
                </div>
            </div>

            {/* --- ÁREA DE GANTT CON SCROLL Y LÓGICA CONDICIONAL --- */}
            <div className="flex-1 mt-2"> {/* Quitamos overflow-y, dejamos que el hijo decida */}
                {isLoadingProjectData ? (
                    // Estado de Carga
                    <div className="flex items-center justify-center w-full h-full p-10 border-t border-gray-200">
                        <p className="text-gray-500">Cargando datos del proyecto...</p>
                    </div>

                ) : projectMembers.length === 0 ? (
                    // Estado 1: No hay Miembros (renderiza el componente de estado vacío)
                    <NoMembersEmptyState />

                ) : (
                    // Estado 2: Hay Miembros (renderiza el Gantt normal)
                    // Añadimos el overflow-y aquí, solo cuando el Gantt es visible
                    <div className="overflow-y-auto border-t border-gray-200" style={{ height: 'calc(100vh - 14rem)' /* Ajustar altura para scroll */ }}>
                        <div className="grid grid-cols-[383px_1fr]">
                            <div className="border-r border-gray-200 bg-white">
                                <GanttTaskListPanel 
                                    tasks={filteredTasks} 
                                    onTaskStatusChange={handleTaskStatusChange}
                                    onTaskUpdate={handleUpdateTask}
                                />
                            </div>
                            <div className="overflow-x-auto">
                                <TimelinePanel 
                                    tasks={filteredTasks} 
                                    viewMode={viewMode}
                                    onTaskClick={handleTaskClickInTimeline}
                                />
                            </div>
                        </div>
                    </div>
                )}
            </div>
            {/* --- FIN DEL ÁREA DE GANTT CONDICIONAL --- */}


            {/* --- MODALES --- */}
            {/* El modal de AddTask ahora solo se abrirá si projectMembers.length > 0 */}
            {isAddTaskModalOpen && (
                <AddTaskModal
                    onClose={() => setIsAddTaskModalOpen(false)}
                    onAddTask={handleAddTask}
                    projectId={selectedProject}
                />
            )}

            {selectedTaskForComments && (
                <TaskCommentsModal
                    task={selectedTaskForComments}
                    onClose={() => setSelectedTaskForComments(null)}
                />
            )}

            {isFilterModalOpen && (
                <FilterModal
                    isOpen={isFilterModalOpen}
                    onClose={() => setIsFilterModalOpen(false)}
                    onApplyFilters={setActiveFilters}
                    currentFilters={activeFilters} 
                    projectMembers={projectMembers} // <-- CAMBIO: Pasamos el estado 'projectMembers' real
                    currentUserId={currentUser?._id} 
                />
            )}

        </div>
    )
}