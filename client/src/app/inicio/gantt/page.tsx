
'use client';

import { useEffect, useState } from "react";
import { Projects, getUserProjects } from "@/services/projectService"; 
import { getCurrentUser } from '@/services/userService';
import { getTasksByProject } from "@/services/taskService"; 
import { Task } from "@/services/taskService";
import GanttToolBar from "@/components/gantt/ganttToolBar";
import GanttTaskListPanel from "@/components/gantt/ganttTaskListPanel";
import TimelinePanel from "@/components/gantt/timelinePanel";


export default function Gantt(){

    const [projects, setProjects] = useState<Projects[]>([]);
    const [selectedProject, setSelectedProject] = useState<string>('');
    const [tasks, setTasks] = useState<Task[]>([])

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
            if(selectedProject){
                const projectTasks = await getTasksByProject(selectedProject);
                setTasks(projectTasks);
            }
        }

        fetchTasks();
    },[selectedProject]);

    const handleStatusToggle = (taskId: string) => {
    setTasks(tasks.map(task => {
        if (task._id === taskId) {
            const newStatus = task.status === 'Sin iniciar' ? 'En progreso' : task.status === 'En progreso' ? 'Terminada' : 'Sin iniciar';
            return { ...task, status: newStatus };
        }
        return task;
    }));
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
                    <GanttToolBar/>
                </div>

                <div className="flex-1 grid grid-cols-[383px_1fr] overflow-y-auto mt-2 border-t border-gray-200">
                   
                    <div className="border-r border-gray-200 bg-white">
                        <GanttTaskListPanel 
                            tasks={tasks}
                            onTaskStatusChange={handleStatusToggle}
                        />
                    </div>
                   
                    <div className="overflow-x-auto">
                        <TimelinePanel tasks={tasks} />
                    </div>
                </div>

            </div>

        </div>
    )
}