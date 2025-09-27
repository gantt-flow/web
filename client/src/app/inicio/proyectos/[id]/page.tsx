'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { useRouter } from 'next/navigation';
import { getProjectById, Projects, addMember, removeMember, deleteProject } from '@/services/projectService';
import { DataTable } from '@/components/ui/DataTable';
import AddMemberModal from '@/components/addMember';
import { CircleDashed, CalendarClock, Contact, Pen, Trash } from "lucide-react"
import ConfirmDeleteProjectModal from '@/components/confirmDeleteProject';

export default function ProjectDetailsPage() {
    const params = useParams();
    const router = useRouter();
    const { id: projectId } = params;
    const [project, setProject] = useState<Projects | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isAddMemberModalOpen, setIsAddMemberModalOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

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

    const handleRemoveMember = async (memberId: string) => {

    if (typeof projectId !== 'string' || !project) return;
        if (confirm('¿Estás seguro de que quieres eliminar a este miembro del proyecto?')) {
        await removeMember(projectId, memberId);
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
        render: (value: any) => <div>fotoDePerfil por implementar</div>
        },
        { key: 'name', header: 'Nombre' },
        { key: 'email', header: 'Email' },
        { key: 'role', header: 'Rol' },
        {
        key: 'actions',
        header: 'Acciones',
        render: (_: any, row: any) => (
            <div className="space-x-2">
                <button onClick={() => alert('Función de mensaje no implementada')} className="text-blue-600 hover:underline cursor-pointer">Mensaje</button>
                <button onClick={() => handleRemoveMember(row._id)} className="text-red-600 hover:underline cursor-pointer">Quitar</button>
            </div>
        )
        }
    ];

    const handleEditProjectClick = (projectId: string) => {
        router.push(`/inicio/proyectos/informacionProyecto/${projectId}`);
    }

    const handleConfirmDelete = async () => {
        if (typeof projectId !== 'string') return;
        try {
            await deleteProject(projectId);
            router.push(`/inicio/proyectos/`);
        } catch (error) {
            console.error("Error al eliminar el proyecto", error);
        } finally {
            setIsDeleteModalOpen(false);
        }
    }


    if (isLoading) {
        return <div className="p-8 text-center text-gray-500 dark:text-gray-400">Cargando detalles del proyecto...</div>;
    }

    if (!project) {
        return <div className="p-8 text-center text-red-500 dark:text-red-400">Proyecto no encontrado.</div>;
    }

    return (
        <>
            <div className="p-8 w-full bg-gray-50 dark:bg-gray-900">
                <div className='flex flex-row items-center'>
                    <h1 className="flex-1 text-4xl font-bold text-gray-800 dark:text-gray-100">{project.name}</h1>
                    <button 
                        onClick={ () => handleEditProjectClick(project._id)}
                        className='flex px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 dark:bg-green-600 dark:hover:bg-green-700 cursor-pointer transition-colors'
                    >
                        <Pen size={15} className='self-center mr-2'/>Editar proyecto
                    </button>

                    <button 
                        onClick={() => setIsDeleteModalOpen(true)}
                        className='flex ml-2 px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 dark:bg-red-500 dark:hover:bg-red-600 cursor-pointer transition-colors'
                    >
                        <Trash size={15} className='self-center mr-2'/>Eliminar proyecto
                    </button>
                </div>
                
                <p className="mt-4 text-lg text-gray-700 dark:text-gray-400">{project.description}</p>

                <div className="mt-6 p-4 border rounded-md bg-white dark:bg-gray-800 dark:border-gray-700">
                    <p className="font-semibold text-gray-800 dark:text-gray-100">Detalles</p>
                    <div className="flex flex-row mt-4 justify-between text-gray-700 dark:text-gray-300">

                        <div className='flex flex-row items-center'>
                            <CircleDashed size={45} color="#2ac66d" strokeWidth={1.75} />
                            <div className='flex flex-col px-2'>
                                <p className="font-semibold">Estado</p>
                                <p>{project.status}</p>
                            </div>
                        </div>

                        <div className='flex flex-row items-center'>
                            <CalendarClock size={45} color="#d28a37" strokeWidth={1.75}/>
                            <div className='flex flex-col px-2'>
                                <p className="font-semibold">Fecha de inicio</p>
                                <p>{new Date(project.startDate).toLocaleDateString()}</p>
                            </div>
                        </div>
                        
                        <div className='flex flex-row items-center'>
                            <CalendarClock size={45} color="#346fe5" strokeWidth={1.75}/>
                            <div className='flex flex-col px-2'>
                                <p className="font-semibold">Fecha de fin</p>
                                <p>{new Date(project.endDate).toLocaleDateString()}</p>
                            </div>
                        </div>
                        
                        <div className='flex flex-row items-center'>
                            <Contact size={45} color="#acba45" strokeWidth={1.75} />
                            <div className='flex flex-col px-2'>
                                <p className="font-semibold">Manager</p>
                                <p>{project.projectManager.name}</p>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="mt-8 flex-1">
                    <div className="flex justify-between items-center mb-4">
                        <h2 className="text-3xl font-bold text-gray-800 dark:text-gray-100">Miembros del Equipo</h2>
                        <button onClick={() => setIsAddMemberModalOpen(true)} className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 dark:bg-green-600 dark:hover:bg-green-700 cursor-pointer transition-colors">
                            + Agregar Miembro
                        </button>
                    </div>

                    { project.teamMembers.length === 0 && (
                       <div className='justify-self-center mt-40 text-center text-gray-500 dark:text-gray-400'>
                        <p>¡Parece que no has agregado a nadie!</p>
                        <p>Agrega miembros para empezar a verlos en la lista.</p>
                       </div>
                    )}

                    { project.teamMembers.length > 0 && (
                        <DataTable columns={memberColumns} data={project.teamMembers} />
                    )}
                </div>

                {isAddMemberModalOpen && (
                    <AddMemberModal 
                    onClose={() => setIsAddMemberModalOpen(false)}
                    projectId={projectId as string}
                    projectName={project.name}
                    onInvitationSent={() => {
                        console.log('Invitación enviada con éxito');
                    }}
                    />
                )}
            </div>
            
            <ConfirmDeleteProjectModal
                isOpen={isDeleteModalOpen}
                onClose={() => setIsDeleteModalOpen(false)}
                onConfirm={handleConfirmDelete}
                projectName={project.name}
            />
        </>
    );
}

