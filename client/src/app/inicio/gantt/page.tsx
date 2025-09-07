
'use client';

import { useEffect, useState } from "react";
import { Projects, getUserProjects } from "@/services/projectService"; 
import { getCurrentUser } from '@/services/userService'; 
import GanttToolBar from "@/components/gantt/ganttToolBar";
import GanttTaskListPanel from "@/components/gantt/ganttTaskListPanel";


export default function Gantt(){

    const [projects, setProjects] = useState<Projects[]>([]);
    const [selectedProject, setSelectedProject] = useState<string>('');

    useEffect(() => {
        async function fetchProjects() {
            try {
                
                // Obtener el usuario actual para conseguir su ID
                const { user } = await getCurrentUser();
                
                if (user && user._id) {
                    // Usamos el ID del usuario para obtener sus proyectos
                    const userProjects = await getUserProjects(user._id);
                    setProjects(userProjects);
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


    return(
        <div className="flex flex-1 flex-col">

            <div className="h-12 mt-4 ml-4">
                { projects && projects.length > 0 && (
                    <select 
                        name="project"
                        value={selectedProject || ''}
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

                <div className="flex flex-1 mt-2">
                    
                    <div className="w-95">
                        <GanttTaskListPanel />
                    </div>

                    <div className="flex-1 ml-20">
                            <p>Space for actual Gantt Chart</p>
                    </div>
                </div>
            </div>

        </div>
    )
}