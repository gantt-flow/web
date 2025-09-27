'use client';

import { useState, useEffect } from "react";
import { useRouter } from 'next/navigation';
import Button from "@/components/ui/button";
import { getUserProjects, Projects } from "@/services/projectService"; 
import { getCurrentUser } from '@/services/userService'; 
import { FolderKanban } from "lucide-react";

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
                const { user } = await getCurrentUser();
                
                if (user && user._id) {
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
        <div className="flex flex-col w-full min-h-full p-4 sm:p-6 lg:p-8 bg-gray-50 dark:bg-gray-900">
            {isLoading && <p className="text-center text-gray-500 dark:text-gray-400">Cargando proyectos...</p>}
            {error && <p className="text-center text-red-500 dark:text-red-400">{error}</p>}
            
            {!isLoading && !error && projects.length === 0 && (
                <div className="flex-grow flex flex-col justify-center items-center text-center">
                    <FolderKanban size={64} className="text-gray-400 dark:text-gray-500 mb-4" />
                    <h2 className="text-3xl font-bold text-gray-800 dark:text-gray-100">Dale vida a tu primer proyecto</h2>
                    <p className="mt-4 max-w-md text-gray-600 dark:text-gray-400">
                        Todo gran logro comienza con un primer paso. Organiza tus tareas, colabora con tu equipo y alcanza tus objetivos.
                    </p>
                    <Button 
                        text="Comenzar un Nuevo Proyecto" 
                        type="button" 
                        className="mt-8 inline-block w-auto px-6 py-3 cursor-pointer rounded-lg bg-green-500 text-white font-semibold shadow-md hover:bg-green-600 dark:bg-green-600 dark:hover:bg-green-700 transition-colors" 
                        redirectTo="/inicio/proyectos/informacionProyecto"
                    />
                </div>
            )}

            {!isLoading && !error && projects.length > 0 && (
                <>
                    <div className="flex-shrink-0">
                        <h1 className="text-4xl md:text-5xl font-bold text-gray-800 dark:text-gray-100">Proyectos</h1>
                        <Button 
                            text="Nuevo proyecto" 
                            type="button" 
                            className="mt-4 inline-block w-auto px-6 py-2 cursor-pointer rounded-lg bg-green-500 text-white font-semibold shadow-md hover:bg-green-600 dark:bg-green-600 dark:hover:bg-green-700 transition-colors" 
                            redirectTo="/inicio/proyectos/informacionProyecto"
                        />
                    </div>
                    <div className="mt-8">
                        <div className="space-y-4">
                            {projects.map(project => (
                                <div key={project._id} className="p-4 border border-gray-200 rounded-lg shadow-sm bg-white hover:shadow-md transition-shadow dark:bg-gray-800 dark:border-gray-700">
                                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                                        <h3 className="text-2xl font-bold text-gray-900 dark:text-gray-100">{project.name}</h3>
                                        <button 
                                            onClick={() => handleDetailsClick(project._id)}
                                            className="mt-3 sm:mt-0 px-5 py-2 rounded-lg bg-sky-500 text-white font-medium hover:bg-sky-600 dark:bg-sky-600 dark:hover:bg-sky-700 transition-colors self-start sm:self-center">
                                            Detalles    
                                        </button>
                                    </div>
    
                                    <p className="mt-2 text-gray-600 dark:text-gray-400">{project.description}</p>

                                    <div className="flex text-center mt-6 border-t pt-4 dark:border-gray-700">
                                        <div className="w-1/2">
                                            <p className="text-sm font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Miembros</p>
                                            <p className="text-2xl font-semibold text-gray-800 dark:text-gray-200">{project.teamMembers.length}</p>
                                        </div>
                                        <div className="w-1/2">
                                             <p className="text-sm font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Estado</p>
                                             <p className="text-lg font-semibold text-gray-800 dark:text-gray-200">{project.status}</p>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </>
            )}
        </div>
    )
}