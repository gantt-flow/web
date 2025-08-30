'use client';

import { useState, useEffect } from "react";
import { useRouter } from 'next/navigation';
import Button from "@/components/ui/button";
import { getUserProjects, Projects } from "@/services/projectService"; 
import { getCurrentUser } from '@/services/userService'; 


export default function Proyectos(){
    const [projects, setProjects] = useState<Projects[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const router = useRouter();

    useEffect(() => {
        async function fetchProjects() {
            try {
                setIsLoading(true);
                setError(null);

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
                setError("No se pudieron cargar los proyectos.");
            } finally {
                setIsLoading(false);
            }
        } 

        fetchProjects();

    }, []);

    const handleDetailsClick = (projectId: string) => {
        router.push(`/inicio/proyectos/${projectId}`);
    };

    return(
        <div className="flex flex-row w-full">

            <div className="flex flex-col flex-1 mx-2 mt-2">
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
                            redirectTo="/inicio/proyectos/informacionProyecto"
                        />
                    </div>
                )}

                {!isLoading && !error && projects.length > 0 && (
                    <div className="mt-6">
                        <Button 
                            text="Nuevo proyecto" 
                            type="button" 
                            className="w-44 p-2 self-center mb-4 cursor-pointer rounded-lg bg-green-500 border border-gray-200 hover:bg-gray-100 hover:text-green-500" 
                            redirectTo="/inicio/proyectos/informacionProyecto"
                        />
                        {projects.map(project => (
                            <div key={project._id} className="p-4 mb-4 border border-blue-300 rounded-lg shadow-md bg-emerald-500/20">

                                <div className="flex flex-row">
                                    <h3 className="text-2xl flex-1 font-bold">{project.name}</h3>
                                    <button 
                                        onClick={() => handleDetailsClick(project._id)}
                                        className="cursor-pointer w-44 rounded-lg bg-sky-300 hover:bg-sky-400 hover:text-gray-100 border-gray-200">Detalles    
                                    </button>
                                </div>
 
                                <p className="text-gray-600">{project.description}</p>

                                <div className="flex flex-row text-center mt-6">
                                    <p className="text-3xl flex-1/2">Miembros del equipo</p>
                                    <p className="text-3xl flex-1/2">Estado</p>
                                </div>
                                <div className="flex flex-row text-center">
                                    <p className="text-xl flex-1/2">{project.teamMembers.length}</p>
                                    <p className="text-lg flex-1/2">{project.status}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    )
}