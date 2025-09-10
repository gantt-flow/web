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
        <div className="flex flex-col w-full min-h-full p-4 sm:p-6 lg:p-8">
            
            {/* --- SECCIÓN DE CABECERA (Contenido Fijo) --- */}
            {/* Esta parte se mantiene siempre visible en la parte superior del área de contenido. */}
            <div className="flex-shrink-0">
                <h1 className="text-4xl md:text-5xl font-bold text-gray-800">Proyectos</h1>
                <Button 
                    text="Nuevo proyecto" 
                    type="button" 
                    className="mt-4 inline-block w-auto px-6 py-2 cursor-pointer rounded-lg bg-green-500 text-white font-semibold shadow-md hover:bg-green-600 transition-colors" 
                    redirectTo="/inicio/proyectos/informacionProyecto"
                />
            </div>

            {/* --- SECCIÓN DE CONTENIDO (Lista de Proyectos) --- */}
            {/* Este div simplemente contiene la lógica de renderizado. Ya no necesita `flex-1` ni `overflow`. */}
            <div className="mt-8">
                {isLoading && <p className="text-center text-gray-500">Cargando proyectos...</p>}
                {error && <p className="text-center text-red-500">{error}</p>}
                
                {!isLoading && !error && projects.length === 0 && (
                    <div className="text-center py-16">
                        <h2 className="text-2xl font-semibold text-gray-700">¡No hay proyectos por mostrar!</h2>
                        <Button 
                            text="Crear mi primer proyecto" 
                            type="button" 
                            className="mt-6 inline-block w-auto px-6 py-2 cursor-pointer rounded-lg bg-green-500 text-white font-semibold shadow-md hover:bg-green-600 transition-colors" 
                            redirectTo="/inicio/proyectos/informacionProyecto"
                        />
                    </div>
                )}

                {!isLoading && !error && projects.length > 0 && (
                    <div className="space-y-4">
                        {projects.map(project => (
                            <div key={project._id} className="p-4 border border-gray-200 rounded-lg shadow-sm bg-gray-50 hover:shadow-md transition-shadow">
                                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                                    <h3 className="text-2xl font-bold text-gray-900">{project.name}</h3>
                                    <button 
                                        onClick={() => handleDetailsClick(project._id)}
                                        className="mt-3 sm:mt-0 px-5 py-2 rounded-lg bg-sky-500 text-white font-medium hover:bg-sky-600 transition-colors self-start sm:self-center">
                                        Detalles    
                                    </button>
                                </div>
 
                                <p className="mt-2 text-gray-600">{project.description}</p>

                                <div className="flex text-center mt-6 border-t pt-4">
                                    <div className="w-1/2">
                                        <p className="text-sm font-medium text-gray-500 uppercase tracking-wider">Miembros</p>
                                        <p className="text-2xl font-semibold text-gray-800">{project.teamMembers.length}</p>
                                    </div>
                                    <div className="w-1/2">
                                         <p className="text-sm font-medium text-gray-500 uppercase tracking-wider">Estado</p>
                                         <p className="text-lg font-semibold text-gray-800">{project.status}</p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    )
}