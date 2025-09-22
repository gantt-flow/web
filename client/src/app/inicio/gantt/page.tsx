'use client';

import { useEffect, useState, useMemo } from "react"; 
import { useSearchParams, useRouter } from 'next/navigation';
import { Projects, getUserProjects, getTeamMembers } from "@/services/projectService";
import { AuthenticatedUser, getCurrentUser } from '@/services/userService'; 
import { getTasksByProject, updatedTask, Task, NewTask, createTask, deleteTask } from "@/services/taskService"; 
import GanttToolBar from "@/components/gantt/ganttToolBar";
import GanttTaskListPanel from "@/components/gantt/ganttTaskListPanel";
import TimelinePanel from "@/components/gantt/timelinePanel";
import AddTaskModal from "@/components/gantt/addTaskModal";
import TaskCommentsModal from "@/components/gantt/tasksCommentsModal";
import FilterModal, { ActiveFilters } from "@/components/gantt/filterPanel";
import { Users, Plus } from "lucide-react";
import ConfirmDeleteModal from "@/components/gantt/confirmDeleteTask";
import SortModal, { SortOptions } from "@/components/gantt/sortModal";

// --- TIPOS Y ESTADOS ---

export type ViewMode = 'Día' | 'Semana' | 'Mes';
type CurrentUser = AuthenticatedUser['user'];
type Assignee = { _id: string; name: string };

export default function Gantt() {
    // Hooks de Next.js para routing y parámetros
    const searchParams = useSearchParams();
    const router = useRouter();

    // Estados principales del componente
    const [projects, setProjects] = useState<Projects[]>([]);
    const [selectedProject, setSelectedProject] = useState<string>('');
    const [currentUser, setCurrentUser] = useState<CurrentUser | null>(null);
    const [allTasks, setAllTasks] = useState<Task[]>([]); 
    const [projectMembers, setProjectMembers] = useState<Assignee[]>([]);
    const [taskToDelete, setTaskToDelete] = useState<Task | null>(null);
    
    // Estados de UI
    const [isLoadingProjectData, setIsLoadingProjectData] = useState(true);
    const [isAddTaskModalOpen, setIsAddTaskModalOpen] = useState(false);
    const [taskForComments, setTaskForComments] = useState<Task | null>(null); // Estado unificado para modal de comentarios
    const [viewMode, setViewMode] = useState<ViewMode>('Día');
    const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);
    const [activeFilters, setActiveFilters] = useState<ActiveFilters>({
        status: 'all',
        assignee: 'all',
        time: 'all',
        dateRange: { start: '', end: '' },
        priority: 'all',
    });

    // Estados para el orden
    const [isSortModalOpen, setIsSortModalOpen] = useState(false);
    const [sortOptions, setSortOptions] = useState<SortOptions>({
        sortBy: 'createdAt', // Orden por defecto
        order: 'asc',
    });


    // --- EFECTOS PARA CARGA DE DATOS ---

    // 1. Obtener el usuario actual al montar el componente
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

    // 2. Obtener proyectos del usuario y seleccionar el proyecto basado en la URL
    useEffect(() => {
        async function fetchProjects() {
            if (currentUser?._id) { 
                try {
                    const userProjects = await getUserProjects(currentUser._id); 
                    setProjects(userProjects);
                    
                    const projectIdFromUrl = searchParams.get('proyecto');

                    if (projectIdFromUrl && userProjects.some(p => p._id === projectIdFromUrl)) {
                        setSelectedProject(projectIdFromUrl);
                    } else if (userProjects.length > 0) {
                        setSelectedProject(userProjects[0]._id);
                    }
                } catch(err) {
                    console.error("Error al obtener proyectos:", err);
                    setProjects([]);
                }
            }
        } 
        fetchProjects();
    }, [currentUser, searchParams]); 

    // 3. Obtener tareas y miembros cada vez que el proyecto seleccionado cambie
    useEffect(() => {
        async function fetchProjectData() {
            if (!selectedProject) {
                 setIsLoadingProjectData(false);
                 return;
            };

            setIsLoadingProjectData(true);
            try {
                const [tasks, members] = await Promise.all([
                    getTasksByProject(selectedProject),
                    getTeamMembers(selectedProject)
                ]);
                
                setAllTasks(tasks || []);
                setProjectMembers(members || []);
            } catch (error) {
                console.error("Error al cargar datos del proyecto:", error);
                setAllTasks([]); 
                setProjectMembers([]);
            } finally {
                setIsLoadingProjectData(false);
            }
        }
        fetchProjectData();
    }, [selectedProject]);

    const handleDeleteTask = async (taskId: string) => {
        // Pedimos confirmación al usuario para evitar borrados accidentales
        if (window.confirm("¿Estás seguro de que quieres eliminar esta tarea?")) {
            try {
                await deleteTask(taskId);
                // Actualizamos el estado local para reflejar el cambio inmediatamente
                setAllTasks(currentTasks => currentTasks.filter(task => task._id !== taskId));
            } catch (error) {
                console.error(`Error al eliminar la tarea ${taskId}:`, error);
                // Opcional: Mostrar una notificación de error al usuario
            }
        }
    };
    

    // 4. Abrir el modal de comentarios si la URL lo indica, después de que las tareas se hayan cargado
    useEffect(() => {
        const commentTaskIdFromUrl = searchParams.get('comentarios');
        
        if (allTasks.length > 0 && commentTaskIdFromUrl && !taskForComments) {
            const taskToOpen = allTasks.find(task => task._id === commentTaskIdFromUrl);
            
            if (taskToOpen) {
                setTaskForComments(taskToOpen);
            }
        }
    }, [allTasks, searchParams]);


    // --- MEMOS Y MANEJADORES DE EVENTOS ---

    const sortedAndFilteredTasks = useMemo(() => {
        // 1. Filtra primero (tu lógica de 'filteredTasks' se mueve aquí)

        let tasks = allTasks.filter(task => {
            if (activeFilters.status !== 'all' && task.status !== activeFilters.status && activeFilters.status !== 'open' && activeFilters.status !== 'closed') return false;
            return true;
        });

        // 2. Ordena después
        tasks.sort((a, b) => {
            const orderMultiplier = sortOptions.order === 'asc' ? 1 : -1;

            switch (sortOptions.sortBy) {
                case 'title':
                    return a.title.localeCompare(b.title) * orderMultiplier;
                case 'dueDate':
                    return (new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime()) * orderMultiplier;
                case 'createdAt':
                    // Asumimos que la API devuelve 'createdAt' en la tarea, si no, hay que añadirlo al modelo y servicio.
                    const dateA = a.createdAt ? new Date(a.createdAt).getTime() : 0;
                    const dateB = b.createdAt ? new Date(b.createdAt).getTime() : 0;
                    return (dateA - dateB) * orderMultiplier;
                default:
                    return 0;
            }
        });

        return tasks;
    }, [allTasks, activeFilters, currentUser, sortOptions]);

    // Manejadores de eventos
    const handleProjectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setSelectedProject(e.target.value);
    };

    const handleAddTask = async (newTask: NewTask) => {
        try {
            await createTask(newTask); 
            if (selectedProject) {
                const updatedTasks = await getTasksByProject(selectedProject);
                setAllTasks(updatedTasks);
            }
        } catch(error) {
            console.error("Error al crear la tarea:", error);
        }
        setIsAddTaskModalOpen(false);
    };
    
    const handleUpdateTask = async (taskId: string, updatedTaskData: Task) => {
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
        const taskToUpdate = allTasks.find(t => t._id === taskId); 
        if (!taskToUpdate) return;
        
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

    const handleSettingsClick = () => {
        if (selectedProject) {
            router.push(`/inicio/proyectos/${selectedProject}`);
        }
    };
    
    const handleToolbarAddTaskClick = () => {
        if (projectMembers.length === 0) {
            alert("No se pueden agregar tareas. Por favor, agrega miembros al proyecto primero.");
            return;
        }
        setIsAddTaskModalOpen(true);
    };

    const handleGoToToday = () => {
        window.dispatchEvent(new CustomEvent('scrollToToday'));
    };

    const handleInitiateDelete = (task: Task) => {
        setTaskToDelete(task);
    };

    const handleConfirmDelete = async () => {
        if (!taskToDelete) return;
        try {
            await deleteTask(taskToDelete._id);
            setAllTasks(current => current.filter(t => t._id !== taskToDelete._id));
            setTaskToDelete(null); // Cierra el modal de confirmación
        } catch (error) {
            console.error(`Error al eliminar la tarea ${taskToDelete._id}:`, error);
        }
    };
    
    const handleApplySort = (options: SortOptions) => {
        setSortOptions(options);
        setIsSortModalOpen(false);
    };

    // --- COMPONENTES DE UI INTERNOS ---
    
    const NoMembersEmptyState = () => (
        <div className="flex flex-col items-center justify-center w-full p-10 bg-white text-center border-t border-gray-200" style={{ height: 'calc(100vh - 14rem)' }}>
             <Users className="w-16 h-16 text-gray-400 mb-4" />
             <h2 className="text-xl font-semibold text-gray-800">Este proyecto no tiene miembros</h2>
             <p className="text-gray-500 max-w-md mt-2 mb-6">
                Para poder crear y asignar tareas, primero debes invitar personas a tu proyecto.
             </p>
             <button 
                onClick={handleSettingsClick}
                className="flex items-center gap-2 px-6 py-2 rounded-md bg-indigo-600 text-white font-semibold hover:bg-indigo-700 transition-colors"
             >
                <Plus size={18} />
                Agregar Personas al Proyecto
             </button>
        </div>
    );

    // --- RENDERIZADO DEL COMPONENTE ---

    return (
        <div className="flex flex-col p-4 pb-0 h-full"> 
            {/* Área superior fija */}
            <div className="flex-shrink-0">
                <div className="h-12">
                    {projects.length > 0 && (
                        <select 
                            name="project"
                            value={selectedProject}
                            onChange={handleProjectChange}
                            className="rounded block w-1/2 max-w-md px-4 py-3 pr-8 bg-white border border-solid border-gray-300 transition ease-in-out m-0 focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none"
                        >
                            {projects.map(project => (
                                <option key={project._id} value={project._id}>{project.name}</option>
                            ))}
                        </select>
                    )}
                </div>
                <div className="h-12 mt-4">
                    <GanttToolBar
                        viewMode={viewMode}
                        onViewModeChange={setViewMode}
                        onAddTaskClick={handleToolbarAddTaskClick}
                        onFilterClick={() => setIsFilterModalOpen(true)} 
                        onSortClick={() => setIsSortModalOpen(true)}
                        onGoToToday={handleGoToToday}
                        onSettingsClick={handleSettingsClick}
                    />
                </div>
            </div>

            {/* Área de Gantt condicional */}
            <div className="flex-1 mt-2">
                {isLoadingProjectData ? (
                    <div className="flex items-center justify-center w-full h-full p-10 border-t border-gray-200">
                        <p className="text-gray-500">Cargando datos del proyecto...</p>
                    </div>
                ) : projectMembers.length === 0 ? (
                    <NoMembersEmptyState />
                ) : (
                    <div className="overflow-y-auto border-t border-gray-200" style={{ height: 'calc(100vh - 14rem)' }}>
                        <div className="grid grid-cols-[383px_1fr]">
                            <div className="border-r border-gray-200 bg-white">
                                <GanttTaskListPanel 
                                    tasks={sortedAndFilteredTasks} 
                                    onTaskStatusChange={handleTaskStatusChange}
                                    onTaskUpdate={handleUpdateTask}
                                    onInitiateDelete={handleInitiateDelete}
                                />
                            </div>
                            <div className="overflow-x-auto">
                                <TimelinePanel 
                                    tasks={sortedAndFilteredTasks} 
                                    viewMode={viewMode}
                                    onTaskClick={setTaskForComments} // Unificado para abrir modal
                                />
                            </div>
                        </div>
                    </div>
                )}
            </div>

            {/* Modales */}
            {isAddTaskModalOpen && (
                <AddTaskModal
                    onClose={() => setIsAddTaskModalOpen(false)}
                    onAddTask={handleAddTask}
                    projectId={selectedProject}
                />
            )}

            {taskForComments && (
                <TaskCommentsModal
                    task={taskForComments}
                    onClose={() => {
                        // 1. Limpiamos el estado para cerrar el modal
                        setTaskForComments(null);
                        
                        // 2. Construimos la nueva URL SIN el parámetro 'comentarios'
                        const newUrl = `/inicio/gantt?proyecto=${selectedProject}`;
                        
                        // 3. Reemplazamos la URL en el historial del navegador sin recargar la página
                        router.replace(newUrl, { scroll: false });
                    }}
                />
            )}

            {isFilterModalOpen && (
                <FilterModal
                    isOpen={isFilterModalOpen}
                    onClose={() => setIsFilterModalOpen(false)}
                    onApplyFilters={setActiveFilters}
                    currentFilters={activeFilters} 
                    projectMembers={projectMembers}
                    currentUserId={currentUser?._id} 
                />
            )}

            {taskToDelete && (
                <ConfirmDeleteModal
                    isOpen={!!taskToDelete}
                    onClose={() => setTaskToDelete(null)}
                    onConfirm={handleConfirmDelete}
                    taskTitle={taskToDelete.title}
                />
            )}

            {isSortModalOpen && (
                <SortModal
                    isOpen={isSortModalOpen}
                    onClose={() => setIsSortModalOpen(false)}
                    onApplySort={handleApplySort}
                    currentSort={sortOptions}
                />
            )}
        </div>
    );
}