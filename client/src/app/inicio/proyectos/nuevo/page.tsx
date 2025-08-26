'use client';


import { useState } from "react";
import { useRouter } from 'next/navigation';
import Image from "next/image";
import { createProject, NewProject } from '@/services/projectService';


// Estados de proyecto
const projectStatuses = ['Sin iniciar', 'En progreso', 'En espera']

export default function Proyectos(){
    const router = useRouter();
    const [formData, setFormData] = useState<NewProject>({
        name: '',
        description: '',
        startDate: '',
        endDate: '',
        status: '',
    });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);


    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({...prev, [name]: value}));
    }
    

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        setIsSubmitting(true)

        try {
            const newProject = await createProject(formData);
            router.push(`/inicio/proyectos/${newProject._id}`);
        }catch(err){
            setError('Hubo un error al crear el proyecto. Por favor, intenta de nuevo.');
            console.error(err);
        } finally {
            setIsSubmitting(false);
        }
    }


    return(
        <div className="flex flex-row w-full">

            <div className="flex flex-col mt-2 px-6">
                <div>
                    <h1 className="text-3xl">Nuevo proyecto</h1>
                </div>

                <div className="flex flex-col flex-1">
                    <form className="flex flex-col mt-10 gap-5" onSubmit={handleSubmit}>
                        <div>
                            <label htmlFor="projectName">Dale un nombre a tu proyecto</label>
                            <div className="mt-2">
                                <input
                                id="name"
                                name="name"
                                type="text"
                                value={formData.name}
                                onChange={handleChange}
                                className="block w-64 rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
                                required
                                />
                            </div>
                        </div>
                        
                        <div>
                            <label htmlFor="projectDescription">Agrega una pequeña descripción</label>
                                <div className="mt-2">
                                    <input
                                    id="description"
                                    name="description"
                                    type="text"
                                    value={formData.description}
                                    onChange={handleChange}
                                    className="block w-64 rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
                                    required
                                    />
                                </div>
                        </div>
                        
                        <div>
                            <label htmlFor="startDate">¿Cuándo comienza tu proyecto?</label>
                                <div className="mt-2">
                                    <input
                                    id="startDate"
                                    name="startDate"
                                    type="date"
                                    value={formData.startDate}
                                    onChange={handleChange}
                                    className="block w-64 rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
                                    />
                                </div>
                        </div>
                        
                        <div>
                            <label htmlFor="projectDescription">¿Sabes cuando termina tu proyecto?</label>
                                <div className="mt-2">
                                    <input
                                    id="endDate"
                                    name="endDate"
                                    type="date"
                                    value={formData.endDate}
                                    onChange={handleChange}
                                    className="block w-64 rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
                                    />
                                </div>
                        </div>

                        <div>
                            <label htmlFor="projectStatus">Estado del proyecto</label>
                            <div className="mt-2">
                                <select name="status" value={formData.status || ''} onChange={handleChange} className="block w-64 rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6" required >
                                    <option value=''>Selecciona estado del proyecto</option>
                                    {projectStatuses.map( projectStatus => (
                                        <option key={projectStatus} value={projectStatus}>{projectStatus}</option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        <button type="submit" className="w-44 p-2 mt-8 cursor-pointer rounded-lg bg-green-500 border border-gray-200 hover:bg-gray-100 hover:text-green-500">Registrar proyecto</button>
                    </form>
                </div>                
            </div>
                
            <div className="flex flex-col justify-center ml-2">
                <Image src="/newProjectTemplate.svg" alt="Magnigier Icon" width={937} height={616} />
            </div>
        </div>
    )
}