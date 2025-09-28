'use client';

import { useEffect, useState, useMemo } from "react"; 
import { useSearchParams, useRouter } from 'next/navigation';
import { Projects, getUserProjects, getTeamMembers } from "@/services/projectService";
import { getCurrentUser, AuthenticatedUser } from '@/services/userService'; 
import { getTasksByProject, updatedTask, Task, NewTask, createTask, deleteTask } from "@/services/taskService"; 
import GanttToolBar from "@/components/gantt/ganttToolBar";
import GanttTaskListPanel from "@/components/gantt/ganttTaskListPanel";
import TimelinePanel from "@/components/gantt/timelinePanel";
import AddTaskModal from "@/components/gantt/addTaskModal";
import TaskCommentsModal from "@/components/gantt/tasksCommentsModal";
import FilterModal, { ActiveFilters } from "@/components/gantt/filterPanel";
import { Users, Plus, LayoutDashboard, ClipboardPlus, UserPlus } from "lucide-react";
import ConfirmDeleteModal from "@/components/gantt/confirmDeleteTask";
import SortModal, { SortOptions } from "@/components/gantt/sortModal";
import Button from "@/components/ui/button";

export type ViewMode = 'Día' | 'Semana' | 'Mes';
type CurrentUser = AuthenticatedUser['user'];
type Assignee = { _id: string; name: string };

export default function Gantt() {
    const searchParams = useSearchParams();
    const router = useRouter();

    const [projects, setProjects] = useState<Projects[]>([]);
    const [selectedProject, setSelectedProject] = useState<string>('');
    const [currentUser, setCurrentUser] = useState<CurrentUser | null>(null);
    const [allTasks, setAllTasks] = useState<Task[]>([]); 
    const [projectMembers, setProjectMembers] = useState<Assignee[]>([]);
    const [taskToDelete, setTaskToDelete] = useState<Task | null>(null);
    
    const [isLoadingProjectData, setIsLoadingProjectData] = useState(true);
    const [isAddTaskModalOpen, setIsAddTaskModalOpen] = useState(false);
    const [taskForComments, setTaskForComments] = useState<Task | null>(null);
    const [viewMode, setViewMode] = useState<ViewMode>('Día');
    const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);
    const [activeFilters, setActiveFilters] = useState<ActiveFilters>({
        status: 'all',
        assignee: 'all',
        time: 'all',
        dateRange: { start: '', end: '' },
        priority: 'all',
        hideCompleted: false,
    });

    const [isSortModalOpen, setIsSortModalOpen] = useState(false);
    const [sortOptions, setSortOptions] = useState<SortOptions>({
        sortBy: 'createdAt',
        order: 'asc',
    });

    useEffect(() => {
        async function fetchCurrentUser() {
            try {
                // Cambiado a checkAuth para consistencia
                const authData = await getCurrentUser(); 
                if (authData.authenticated) setCurrentUser(authData.user); 
            } catch(err) {
                console.error("Error fetching current user:", err);
            }
        }
        fetchCurrentUser();
    }, []); 

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
            } else if (currentUser) {
                // Si hay un usuario pero no proyectos, dejamos de cargar.
                 setIsLoadingProjectData(false);
            }
        } 
        fetchProjects();
    }, [currentUser, searchParams]); 

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
    
    useEffect(() => {
        const commentTaskIdFromUrl = searchParams.get('comentarios');
        
        if (allTasks.length > 0 && commentTaskIdFromUrl && !taskForComments) {
            const taskToOpen = allTasks.find(task => task._id === commentTaskIdFromUrl);
            if (taskToOpen) setTaskForComments(taskToOpen);
        }
    }, [allTasks, searchParams, taskForComments]);

    const sortedAndFilteredTasks = useMemo(() => {
        let tasks = allTasks.filter(task => {
            const now = new Date();
            const dueDate = new Date(task.dueDate);
            now.setHours(0,0,0,0);

            if (activeFilters.hideCompleted && task.status === 'Completada') return false;
            if (activeFilters.status !== 'all' && task.status !== activeFilters.status) return false;
            if (activeFilters.assignee === 'me' && task.assignedTo?._id !== currentUser?._id) return false;
            if (activeFilters.assignee !== 'all' && activeFilters.assignee !== 'me' && task.assignedTo?._id !== activeFilters.assignee) return false;
            if (activeFilters.priority !== 'all' && task.priority !== activeFilters.priority) return false;
            if (activeFilters.time === 'overdue' && (dueDate >= now || task.status === 'Completada')) return false;
            if (activeFilters.time === 'today' && dueDate.toDateString() !== now.toDateString()) return false;
            if (activeFilters.time === 'week') {
                const oneWeekFromNow = new Date();
                oneWeekFromNow.setDate(now.getDate() + 7);
                if (dueDate < now || dueDate > oneWeekFromNow) return false;
            }
            if (activeFilters.dateRange.start && new Date(activeFilters.dateRange.start) > dueDate) return false;
            if (activeFilters.dateRange.end && new Date(activeFilters.dateRange.end) < dueDate) return false;

            return true;
        });

        return tasks.sort((a, b) => {
            const orderMultiplier = sortOptions.order === 'asc' ? 1 : -1;
            switch (sortOptions.sortBy) {
                case 'title':
                    return a.title.localeCompare(b.title) * orderMultiplier;
                case 'dueDate':
                    return (new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime()) * orderMultiplier;
                case 'createdAt':
                    // Fallback to sorting by dueDate if createdAt does not exist
                    // TODO
                    const dateA = new Date(a.dueDate).getTime();
                    const dateB = new Date(b.dueDate).getTime();
                    return (dateA - dateB) * orderMultiplier;
                default:
                    return 0;
            }
        });
    }, [allTasks, activeFilters, currentUser, sortOptions]);

    const handleProjectChange = (e: React.ChangeEvent<HTMLSelectElement>) => setSelectedProject(e.target.value);

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
            const updatedTaskFromServer = await updatedTask(taskId, updatedTaskData);
            setAllTasks(currentTasks => currentTasks.map(task => task._id === taskId ? updatedTaskFromServer : task));
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
            setAllTasks(prevTasks => prevTasks.map(task => task._id === taskId ? updatedTaskFromServer : task));
        } catch (error) {
            console.error("Error al actualizar el estado de la tarea:", error);
        }
    };

    const handleSettingsClick = () => {
        if (selectedProject) router.push(`/inicio/proyectos/${selectedProject}`);
    };
    
    const handleToolbarAddTaskClick = () => {
        if (projectMembers.length === 0) {
            alert("No se pueden agregar tareas. Por favor, agrega miembros al proyecto primero.");
            return;
        }
        setIsAddTaskModalOpen(true);
    };

    const handleGoToToday = () => window.dispatchEvent(new CustomEvent('scrollToToday'));
    const handleInitiateDelete = (task: Task) => setTaskToDelete(task);

    const handleConfirmDelete = async () => {
        if (!taskToDelete) return;
        try {
            await deleteTask(taskToDelete._id);
            setAllTasks(current => current.filter(t => t._id !== taskToDelete._id));
            setTaskToDelete(null);
        } catch (error) {
            console.error(`Error al eliminar la tarea ${taskToDelete._id}:`, error);
        }
    };
    
    const handleApplySort = (options: SortOptions) => {
        setSortOptions(options);
        setIsSortModalOpen(false);
    };
    
    const NoMembersEmptyState = () => (
        <div className="flex flex-col items-center justify-center w-full p-10 bg-white dark:bg-gray-800 text-center border-t border-gray-200 dark:border-gray-700" style={{ height: 'calc(100vh - 14rem)' }}>
             <Users className="w-16 h-16 text-gray-400 dark:text-gray-500 mb-4" />
             <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-100">Este proyecto no tiene miembros</h2>
             <p className="text-gray-500 dark:text-gray-400 max-w-md mt-2 mb-6">
                Para poder crear y asignar tareas, primero debes invitar personas a tu proyecto.
             </p>
             <button 
                onClick={handleSettingsClick}
                className="flex items-center gap-2 px-6 py-2 rounded-md bg-indigo-600 text-white font-semibold hover:bg-indigo-700 dark:bg-indigo-500 dark:hover:bg-indigo-600 transition-colors"
             >
                <Plus size={18} />
                Agregar Personas al Proyecto
             </button>
        </div>
    );

    const NoTasksEmptyState = ({ onAddTaskClick }: { onAddTaskClick: () => void }) => (
        <div className="flex flex-col items-center justify-center w-full p-10 bg-white dark:bg-gray-800 text-center border-t border-gray-200 dark:border-gray-700" style={{ height: 'calc(100vh - 14rem)' }}>
            <ClipboardPlus className="w-16 h-16 text-gray-400 dark:text-gray-500 mb-4" />
            <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-100">Tu proyecto está listo para empezar</h2>
            <p className="text-gray-500 dark:text-gray-400 max-w-md mt-2 mb-6">
                El primer paso es crear una tarea. Asígnale un responsable, establece fechas y observa cómo tu proyecto cobra vida.
            </p>
            <button
                onClick={onAddTaskClick}
                className="flex items-center gap-2 px-6 py-2 rounded-md bg-indigo-600 text-white font-semibold hover:bg-indigo-700 dark:bg-indigo-500 dark:hover:bg-indigo-600 transition-colors"
            >
                <Plus size={18} />
                Crear mi Primera Tarea
            </button>
        </div>
    );
    
    if (!currentUser) {
        return (
            <div className="flex items-center justify-center w-full h-full p-10 bg-gray-50 dark:bg-gray-900">
                <p className="text-gray-500 dark:text-gray-400">Autenticando...</p>
            </div>
        );
    }

    // --- NUEVO BLOQUE DE BIENVENIDA CONDICIONAL ---
    if (projects.length === 0) {
        return (
            <div className="flex-1 flex flex-col items-center justify-center text-center p-8 w-full h-full bg-gray-50 dark:bg-gray-900">
                {currentUser?.role === 'Administrador de proyectos' ? (
                    <>
                        <LayoutDashboard size={64} className="text-gray-400 dark:text-gray-500 mb-4" />
                        <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-200 mb-2">
                            Bienvenido a tu Vista de Gantt
                        </h2>
                        <p className="text-gray-600 dark:text-gray-400 mb-6 max-w-md">
                            Para empezar a visualizar tus tareas, primero necesitas crear un proyecto.
                        </p>
                        <Button 
                            text="Crear mi Primer Proyecto" 
                            type="button" 
                            className="mt-6 inline-block w-auto px-6 py-3 cursor-pointer rounded-lg bg-green-500 text-white font-semibold shadow-md hover:bg-green-600 dark:bg-green-600 dark:hover:bg-green-700 transition-colors" 
                            redirectTo="/inicio/proyectos/informacionProyecto"
                        />
                    </>
                ) : (
                    <>
                        <UserPlus size={64} className="text-gray-400 dark:text-gray-500 mb-4" />
                        <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-200 mb-2">
                            Bienvenido a GanttFlow
                        </h2>
                        <p className="text-gray-600 dark:text-gray-400 mb-6 max-w-md">
                            Aún no has sido asignado a ningún proyecto. Una vez que te agreguen a uno, podrás ver tus tareas aquí.
                        </p>
                        <p className="p-4 bg-blue-100 dark:bg-blue-900/40 text-blue-800 dark:text-blue-300 rounded-lg">
                            Pide a un administrador de proyectos que te invite a colaborar.
                        </p>
                    </>
                )}
            </div>
        )
    }

    return (
        <div className="flex flex-col p-4 pb-0 h-full bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-200"> 
            <div className="flex-shrink-0">
                <div className="h-12">
                    <select 
                        name="project"
                        value={selectedProject}
                        onChange={handleProjectChange}
                        className="rounded block w-1/2 max-w-md px-4 py-3 pr-8 bg-white dark:bg-gray-700 border border-solid border-gray-300 dark:border-gray-600 transition ease-in-out m-0 focus:text-gray-700 dark:focus:text-gray-200 focus:bg-white dark:focus:bg-gray-600 focus:border-blue-600 focus:outline-none"
                    >
                        {projects.map(project => (
                            <option key={project._id} value={project._id} className="dark:bg-gray-700">{project.name}</option>
                        ))}
                    </select>
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

            <div className="flex-1 mt-2">
                {isLoadingProjectData ? (
                    <div className="flex items-center justify-center w-full h-full p-10 border-t border-gray-200 dark:border-gray-700">
                        <p className="text-gray-500 dark:text-gray-400">Cargando datos del proyecto...</p>
                    </div>
                ) : projectMembers.length === 0 ? (
                    <NoMembersEmptyState />
                ) : allTasks.length === 0 ? (
                    <NoTasksEmptyState onAddTaskClick={handleToolbarAddTaskClick} />
                ) : (
                    <div className="overflow-y-auto border-t border-gray-200 dark:border-gray-700" style={{ height: 'calc(100vh - 14rem)' }}>
                        <div className="grid grid-cols-[383px_1fr]">
                            <div className="border-r border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
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
                                    onTaskClick={setTaskForComments}
                                />
                            </div>
                        </div>
                    </div>
                )}
            </div>

            {isAddTaskModalOpen && (
                <AddTaskModal onClose={() => setIsAddTaskModalOpen(false)} onAddTask={handleAddTask} projectId={selectedProject} />
            )}
            {taskForComments && (
                <TaskCommentsModal
                    task={taskForComments}
                    onClose={() => {
                        setTaskForComments(null);
                        const newUrl = `/inicio/gantt?proyecto=${selectedProject}`;
                        router.replace(newUrl, { scroll: false });
                    }}
                />
            )}
            {isFilterModalOpen && (
                <FilterModal isOpen={isFilterModalOpen} onClose={() => setIsFilterModalOpen(false)} onApplyFilters={setActiveFilters} currentFilters={activeFilters} projectMembers={projectMembers} currentUserId={currentUser?._id} />
            )}
            {taskToDelete && (
                <ConfirmDeleteModal isOpen={!!taskToDelete} onClose={() => setTaskToDelete(null)} onConfirm={handleConfirmDelete} taskTitle={taskToDelete.title} />
            )}
            {isSortModalOpen && (
                <SortModal isOpen={isSortModalOpen} onClose={() => setIsSortModalOpen(false)} onApplySort={handleApplySort} currentSort={sortOptions} />
            )}
        </div>
    );
}