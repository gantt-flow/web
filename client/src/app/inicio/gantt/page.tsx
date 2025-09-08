
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
    


    // Referencia para el scroll del timeline
    const timelineRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        async function fetchProjects() {
            try {
                
                // Obtener el usuario actual para conseguir su ID
                const { user } = await getCurrentUser();
                
                if (user && user._id) {
                    // Usamos el ID del usuario para obtener sus proyectos
                    const userProjects = await getUserProjects(user._id);
                    setProjects(userProjects);
                    
                    // Si encontro proyectos se selecciona el primero automáticamente
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

    // Función para obtener las tareas del proyecto
    useEffect(() => {
    async function fetchTasks() {
        if (selectedProject) {
            try {
                const projectTasks = await getTasksByProject(selectedProject);
                setTasks(projectTasks);
            } catch (error) {
                console.error("Error al cargar las tareas, el proyecto podría estar vacío o hubo un problema:", error);
                // Limpia las tareas si hay un error para que la UI no muestre datos antiguos.
                setTasks([]); 
            }
        } else {
            // Si no hay proyecto seleccionado, asegúrate de que no haya tareas
            setTasks([]);
        }
    }

    fetchTasks();
}, [selectedProject]);

    const handleStatusToggle = (taskId: string) => {
    setTasks(tasks.map(task => {
        if (task._id === taskId) {
            const newStatus = task.status === 'Sin iniciar' ? 'En progreso' : task.status === 'En progreso' ? 'Terminada' : 'Sin iniciar';
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
            // Volvemos a obtener las tareas después de crear una tarea
            if (selectedProject) {
                const updatedTasks = await getTasksByProject(selectedProject);
                setTasks(updatedTasks);
            }
        } catch(error) {
            console.error(error);
        }
        setIsAddTaskModalOpen(false); // Cierra el modal
    };

    const handleGoToToday = () => {
        // Lógica para hacer scroll (la implementaremos en el TimelinePanel)
        // Por ahora, podemos emitir un evento o llamar a una función a través de la ref.
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
        // 1. Llama al servicio para guardar en la BD
        await updatedTask(taskId, updatedTaskData); // Asegúrate de importar 'updatedTask' del servicio

        // 2. ACTUALIZA EL ESTADO LOCAL para ver los cambios al instante
        setTasks(currentTasks => 
            currentTasks.map(task => 
                task._id === taskId ? updatedTaskData : task
            )
        );
        
        // No necesitas cerrar el modal desde aquí, eso lo hará el panel.
    } catch (error) {
        console.error("Error al actualizar la tarea:", error);
    }
};


    return(
        <div className="flex flex-1 flex-col h-full">

            <div className="h-12 mt-4 ml-4">
                { projects && projects.length > 0 && (
                    <select 
                        name="project"
                        value={selectedProject}
                        onChange={handleProjectChange}
                        className="
                        rounded
                        block
                        w-1/2
                        px-4 py-3
                        pr-8 
                        bg-white bg-clip-padding bg-no-repeat
                        border border-solid border-gray-300
                        transition
                        ease-in-out
                        m-0
                        focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none" required 
                    >
                        {projects.map( project => (
                            <option key={project._id}  value={project._id}>{project.name}</option>
                        ))}
                    </select>
                )}
            </div>

            <div className="flex flex-col flex-1">

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

                <div className="flex-1 grid grid-cols-[383px_1fr] overflow-y-auto mt-2 border-t border-gray-200">
                   
                    <div className="border-r border-gray-200 bg-white">
                        <GanttTaskListPanel 
                            tasks={tasks}
                            onTaskStatusChange={handleStatusToggle}
                            onTaskUpdate={handleUpdateTask}
                        />
                    </div>
                   
                    <div className="overflow-x-auto" ref={timelineRef}>
                        <TimelinePanel tasks={tasks} viewMode={viewMode}/>
                    </div>
                </div>

            </div>

            {/* Renderizado condicional del modal */}
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

