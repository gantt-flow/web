'use client';


import { useState, useEffect } from "react";
import { useRouter, useParams } from 'next/navigation';
import Image from "next/image";
import { NewProject, getProjectById, updateProject } from '@/services/projectService';


const projectStatuses = ['Sin iniciar', 'En progreso', 'En espera']

export default function Proyectos(){
    const router = useRouter();
    const params = useParams();

    const { id: projectId } = params;
    const [project, setProject] = useState<NewProject | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const fetchProject = async () => {
        if (typeof projectId !== 'string') return;
        try {
        setIsLoading(true);
        const projectData = await getProjectById(projectId);
        setProject(projectData);
        } catch (error) {
        console.error("Error al cargar el proyecto:", error);
        } finally {
        setIsLoading(false);
        }
    };

     useEffect(() => {
        fetchProject();
    }, [projectId]);

    const [formData, setFormData] = useState<NewProject>({
        _id: '',
        name: '',
        description: '',
        startDate: '',
        endDate: '',
        status: '',
    });

    useEffect(() => {
        if (project) {
            setFormData({
                _id: project._id || '',
                name: project.name || '',
                description: project.description || '',
                startDate: project.startDate ? new Date(project.startDate).toISOString().split('T')[0] : '',
                endDate: project.endDate ? new Date(project.endDate).toISOString().split('T')[0] : '',
                status: project.status || '',
            });
        }
    }, [project]);
    

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({...prev, [name]: value}));
    }
    

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        setIsSubmitting(true)

        try {
            const newProject = await updateProject(String(projectId), formData);            
            router.push(`/inicio/proyectos/${projectId}`);
        }catch(err){
            setError('Hubo un error al editar el proyecto. Por favor, intenta de nuevo.');
            console.error(err);
        } finally {
            setIsSubmitting(false);
        }
    }

     if (isLoading) {
        return <div className="p-8 text-center text-gray-500 dark:text-gray-400">Cargando detalles del proyecto...</div>;
    }

    if (!project) {
        return <div className="p-8 text-center text-red-500 dark:text-red-400">Proyecto no encontrado.</div>;
    }

    if(isSubmitting){
        return(<p className="p-8 text-center text-gray-500 dark:text-gray-400">Guardando datos...</p>)
    }

    if(error){
        return(<p className="p-8 text-center text-red-500 dark:text-red-400">Error: {error}</p>)
    }


    return(
        <div className="flex flex-row w-full bg-gray-50 dark:bg-gray-900 p-8">

            <div className="flex flex-col flex-1 max-w-lg">
                <div>
                    <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-100">Editar proyecto</h1>
                </div>

                <div className="flex flex-col flex-1 mt-8">
                    <form className="flex flex-col gap-5" onSubmit={handleSubmit}>
                        <div>
                            <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Dale un nombre a tu proyecto</label>
                            <input
                                id="name"
                                name="name"
                                type="text"
                                value={formData.name}
                                onChange={handleChange}
                                className="block w-full rounded-md bg-white dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200 px-3 py-2 border border-gray-300 focus:ring-indigo-500 focus:border-indigo-500"
                                required
                            />
                        </div>
                        
                        <div>
                            <label htmlFor="description" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Agrega una pequeña descripción</label>
                            <input
                                id="description"
                                name="description"
                                type="text"
                                value={formData.description}
                                onChange={handleChange}
                                className="block w-full rounded-md bg-white dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200 px-3 py-2 border border-gray-300 focus:ring-indigo-500 focus:border-indigo-500"
                                required
                            />
                        </div>
                        
                        <div>
                            <label htmlFor="startDate" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">¿Cuándo comienza tu proyecto?</label>
                            <input
                                id="startDate"
                                name="startDate"
                                type="date"
                                value={formData.startDate}
                                onChange={handleChange}
                                className="block w-full rounded-md bg-white dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200 px-3 py-2 border border-gray-300"
                            />
                        </div>
                        
                        <div>
                            <label htmlFor="endDate" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">¿Sabes cuando termina tu proyecto?</label>
                            <input
                                id="endDate"
                                name="endDate"
                                type="date"
                                value={formData.endDate}
                                onChange={handleChange}
                                className="block w-full rounded-md bg-white dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200 px-3 py-2 border border-gray-300"
                            />
                        </div>

                        <div>
                            <label htmlFor="status" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Estado del proyecto</label>
                            <select name="status" value={formData.status || ''} onChange={handleChange} className="block w-full rounded-md bg-white dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200 px-3 py-2 border border-gray-300 focus:ring-indigo-500 focus:border-indigo-500" required >
                                <option value='' className="dark:bg-gray-700">Selecciona estado del proyecto</option>
                                {projectStatuses.map( projectStatus => (
                                    <option key={projectStatus} value={projectStatus} className="dark:bg-gray-700">{projectStatus}</option>
                                ))}
                            </select>
                        </div>

                        <button type="submit" className="w-44 p-2 mt-8 cursor-pointer rounded-lg bg-green-500 text-white font-semibold hover:bg-green-600 dark:bg-green-600 dark:hover:bg-green-700 transition-colors">
                            Guardar cambios
                        </button>
                    </form>
                </div>                
            </div>
                
            <div className="hidden lg:flex flex-col justify-center items-center flex-1 ml-8">
                <Image src="/newProjectTemplate.svg" alt="Ilustración de un nuevo proyecto" width={937} height={616} />
            </div>
        </div>
    )
}
