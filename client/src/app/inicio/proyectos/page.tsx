'use client';

import { useState, useEffect } from "react";
import Button from "@/components/ui/button";
import { getUserProjects, UserProjects } from "@/services/projectService"; 
import { getCurrentUser } from '@/services/userService'; 


export default function Proyectos(){
    const [projects, setProjects] = useState<UserProjects[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        async function fetchProjects() {
            try {
                setIsLoading(true);
                setError(null);

                // Obtener el usuario actual
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
                setError("No se pudieron cargar los proyectos.");
            } finally {
                setIsLoading(false);
            }
        } 

        fetchProjects();

    }, []);

    return(
        <div className="flex flex-row w-full">

            <div className="flex flex-col flex-1 ml-2 mt-2">
                <div>
                    <h1 className="text-6xl">Proyectos</h1>
                </div>

                {isLoading && <p>Cargando proyectos...</p>}
                {error && <p className="text-red-500">{error}</p>}
                
                {!isLoading && !error && projects.length === 0 && (
                    <div className="flex flex-col flex-1 justify-center">
                        <h2 className="text-2xl text-center">¡No hay proyectos por mostrar!</h2>
                        <Button 
                            text="Nuevo proyecto" 
                            type="button" 
                            className="w-44 p-2 self-center mt-8 cursor-pointer rounded-lg bg-green-500 border border-gray-200 hover:bg-gray-100 hover:text-green-500" 
                            redirectTo="/inicio/proyectos/nuevo"
                        />
                    </div>
                )}

                {!isLoading && !error && projects.length > 0 && (
                    <div className="mt-6">
                        {projects.map(project => (
                            <div key={project._id} className="p-4 mb-4 border rounded-lg shadow-md">
                                <h3 className="text-2xl font-bold">{project.name}</h3>
                                <p className="text-gray-600">{project.description}</p>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    )
}