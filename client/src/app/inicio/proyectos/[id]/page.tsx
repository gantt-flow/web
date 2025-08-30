'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { useRouter } from 'next/navigation';
import { getProjectById, Projects, addMember, removeMember } from '@/services/projectService';
import { DataTable } from '@/components/ui/DataTable';
import AddMemberModal from '@/components/addMember';
import { CircleDashed, CalendarClock, Contact, Pen } from "lucide-react"

export default function ProjectDetailsPage() {
    const params = useParams();
    const router = useRouter();
    const { id: projectId } = params; // Extrae el ID de la URL
    const [project, setProject] = useState<Projects | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);

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

    const handleAddMember = async (email: string) => {

        if (typeof projectId !== 'string' || !project) return;

        const updatedMembers = await addMember(projectId, email);
        setProject({ ...project, teamMembers: updatedMembers });
    };

    const handleRemoveMember = async (memberId: string) => {

    if (typeof projectId !== 'string' || !project) return;
        if (confirm('¿Estás seguro de que quieres eliminar a este miembro del proyecto?')) {
        await removeMember(projectId, memberId);
        // Actualiza el estado local para reflejar el cambio inmediatamente
        setProject({
            ...project,
            teamMembers: project.teamMembers.filter(member => member._id !== memberId)
        });
        }
    };

    const memberColumns = [
        {
        key: 'profilePicture',
        header: 'Foto',
        render: (value: any) => <div>fotoDePerfil por implementar</div> // TODO Placeholder
        },
        { key: 'name', header: 'Nombre' },
        { key: 'email', header: 'Email' },
        { key: 'role', header: 'Rol' },
        {
        key: 'actions',
        header: 'Acciones',
        render: (_: any, row: any) => (
            <div className="space-x-2">
                <button onClick={() => alert('Función de mensaje no implementada')} className="text-blue-600 hover:underline">Mensaje</button>
                <button onClick={() => handleRemoveMember(row._id)} className="text-red-600 hover:underline">Quitar</button>
            </div>
        )
        }
    ];

    const handleEditProjectClick = (projectId: string) => {
        router.push(`/inicio/proyectos/informacionProyecto/${projectId}`);
    }


    if (isLoading) {
        return <div>Cargando detalles del proyecto...</div>;
    }

    if (!project) {
        return <div>Proyecto no encontrado.</div>;
    }

    return (
        <div className="p-8 flex-row w-full">
            <div className='flex flex-row'>
                <h1 className="flex-1 text-4xl font-bold">{project.name}</h1>
                <button 
                    onClick={ () => handleEditProjectClick(project._id)}
                    className='flex px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600'
                >
                    <Pen size={15} className='self-center mr-2'/>Editar proyecto
                </button>
            </div>
            
            <p className="mt-4 text-lg text-gray-700">{project.description}</p>

            <div className="mt-6 p-4 border rounded-md">
                <p>Detalles</p>
                <div className="flex flex-row mt-4 justify-between">

                    <div className='flex flex-row'>
                        <CircleDashed size={45} color="#2ac66d" strokeWidth={1.75} />
                        <div className='flex flex-col px-2'>
                            <p><strong>Estado</strong> </p>
                            <p>{project.status}</p>
                        </div>
                    </div>

                    <div className='flex flex-row'>
                        <CalendarClock size={45} color="#d28a37" strokeWidth={1.75}/>
                        <div className='flex flex-col px-2'>
                            <p><strong>Fecha de inicio</strong></p>
                            <p>{new Date(project.startDate).toLocaleDateString()}</p>
                        </div>
                        
                    </div>
                    
                    <div className='flex flex-row'>
                        <CalendarClock size={45} color="#346fe5" strokeWidth={1.75}/>
                        <div className='flex flex-col px-2'>
                            <p><strong>Fecha de fin</strong> </p>
                            <p>{new Date(project.endDate).toLocaleDateString()}</p>
                        </div>
                    </div>
                    
                    <div className='flex flex-row'>
                        <Contact size={45} color="#acba45" strokeWidth={1.75} />
                        <div className='flex flex-col px-2'>
                            <p><strong>Manager</strong> </p>
                            <p>{project.projectManager.name}</p>
                        </div>
                    </div>
                </div>
            </div>

            <div className="mt-8 flex-1">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-3xl font-bold">Miembros del Equipo</h2>
                    <button onClick={() => setIsModalOpen(true)} className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600">
                        + Agregar Miembro
                    </button>
                </div>

                { project.teamMembers.length === 0 && (
                   <div className='justify-self-center mt-40 text-center'>
                    <p>¡Parece que no has agregado a nadie!</p>
                    <p>Agrega miembros para empezar a verlos en la lista.</p>
                   </div>
                )}

                { project.teamMembers.length > 0 && (
                    <DataTable columns={memberColumns} data={project.teamMembers} />
                )}
            </div>

            {isModalOpen && (
                <AddMemberModal 
                    onClose={() => setIsModalOpen(false)}
                    onAddMember={handleAddMember}
                />
            )}
        </div>
    );
}