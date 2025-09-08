'use client';

import { useEffect, useState, useRef } from "react";
import { useRouter } from 'next/navigation';
import { Projects, getUserProjects } from "@/services/projectService"; 
import { getCurrentUser } from '@/services/userService';
import { getTasksByProject, updatedTask } from "@/services/taskService"; 
import { Task, NewTask, createTask } from "@/services/taskService";
import GanttToolBar from "@/components/gantt/ganttToolBar";
import GanttTaskListPanel from "@/components/gantt/ganttTaskListPanel";
import TimelinePanel from "@/components/gantt/timelinePanel";
import AddTaskModal from "@/components/gantt/addTaskModal";


export type ViewMode = 'Día' | 'Semana' | 'Mes';


export default function Gantt(){

    const [projects, setProjects] = useState<Projects[]>([]);
    const [selectedProject, setSelectedProject] = useState<string>('');
    const [tasks, setTasks] = useState<Task[]>([]);
    const router = useRouter();
    const [viewMode, setViewMode] = useState<ViewMode>('Día');
    const [isAddTaskModalOpen, setIsAddTaskModalOpen] = useState(false);
    
    // Las funciones y useEffects no cambian...
    // ... (todo el código de lógica que ya tienes)
    useEffect(() => {
        async function fetchProjects() {
            try {
                const { user } = await getCurrentUser();
                if (user && user._id) {
                    const userProjects = await getUserProjects(user._id);
                    setProjects(userProjects);
                    if (userProjects.length > 0) {
                        setSelectedProject(userProjects[0]._id);
                    }
                } else {
                    setProjects([]);
                }
            } catch(err) {
                console.error("Error al obtener proyectos:", err);
            }
        } 
        fetchProjects();
    },[]);

    const handleProjectChange = (e: React.ChangeEvent< HTMLSelectElement>) => {
        const value = e.target.value;
        setSelectedProject(value);
    }

    useEffect(() => {
        async function fetchTasks() {
            if (selectedProject) {
                try {
                    const projectTasks = await getTasksByProject(selectedProject);
                    setTasks(projectTasks);
                } catch (error) {
                    console.error("Error al cargar las tareas, el proyecto podría estar vacío o hubo un problema:", error);
                    setTasks([]); 
                }
            } else {
                setTasks([]);
            }
        }
        fetchTasks();
    },[selectedProject]);

    const handleStatusToggle = (taskId: string) => {
        setTasks(tasks.map(task => {
            if (task._id === taskId) {
                const newStatus = task.status === 'Sin iniciar' ? 'En progreso' : task.status === 'En progreso' ? 'Completada' : 'Sin iniciar';
                return { ...task, status: newStatus };
            }
            return task;
        }));
    };

    const handleViewModeChange = (mode: ViewMode) => {
        setViewMode(mode);
    };

    const handleAddTask = async (newTask: NewTask) => {
        try {
            await createTask(newTask);
            if (selectedProject) {
                const updatedTasks = await getTasksByProject(selectedProject);
                setTasks(updatedTasks);
            }
        } catch(error) {
            console.error(error);
        }
        setIsAddTaskModalOpen(false);
    };

    const handleGoToToday = () => {
        const event = new CustomEvent('scrollToToday');
        window.dispatchEvent(event);
    };

    const handleSettingsClick = () => {
        if (selectedProject) {
            router.push(`/inicio/proyectos/informacionProyecto/${selectedProject}`);
        }
    };

    const handleUpdateTask = async (taskId: string, updatedTaskData: Task) => {
        try {
            await updatedTask(taskId, updatedTaskData);
            setTasks(currentTasks => 
                currentTasks.map(task => 
                    task._id === taskId ? updatedTaskData : task
                )
            );
        } catch (error) {
            console.error("Error al actualizar la tarea:", error);
        }
    };

    // --- 🚀 FIX: Nueva estructura de layout ---
    return(
        // Contenedor principal que ocupa toda la pantalla y no permite scroll
        <div className="flex flex-col h-screen p-4 pb-0">

            {/* --- ÁREA SUPERIOR FIJA (NO SE MUEVE) --- */}
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
                        onAddTaskClick={() => setIsAddTaskModalOpen(true)}
                        onFilterClick={() => alert('Filtro clickeado!')}
                        onGoToToday={handleGoToToday}
                        onSettingsClick={handleSettingsClick}
                    />
                </div>
            </div>

            {/* --- ÁREA DE GANTT CON SCROLL --- */}
            {/* Este contenedor crece para llenar el espacio y maneja el scroll vertical */}
            <div className="flex-1 overflow-y-auto mt-2 border-t border-gray-200">
                <div className="grid grid-cols-[383px_1fr]">
                    <div className="border-r border-gray-200 bg-white">
                        <GanttTaskListPanel 
                            tasks={tasks}
                            onTaskStatusChange={handleStatusToggle}
                            onTaskUpdate={handleUpdateTask}
                        />
                    </div>
                    <div className="overflow-x-auto">
                        <TimelinePanel tasks={tasks} viewMode={viewMode}/>
                    </div>
                </div>
            </div>

            {isAddTaskModalOpen && (
                <AddTaskModal
                    onClose={() => setIsAddTaskModalOpen(false)}
                    onAddTask={handleAddTask}
                    projectId={selectedProject}
                />
            )}
        </div>
    )
}