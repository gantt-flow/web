'use client';

import { useState, useEffect, useRef } from 'react';
import { NewTask } from '@/services/taskService';
import { getProjectTasks, getTeamMembers } from '@/services/projectService';

interface AddTaskModalProps {
    onClose: () => void;
    onAddTask: (task: NewTask) => void | Promise<void>;
    projectId: string;
}

interface TeamMember {
    _id: string;
    name: string;
}

interface Task {
    _id: string;
    title: string;
}

const taskStatuses = ['Sin iniciar', 'En progreso', 'Completada', 'En espera'];
const taskPriorities = ['Baja', 'Media', 'Alta'];
const type = ['Tarea', 'Milestone'];

export default function AddTaskModal({ onClose, onAddTask, projectId }: AddTaskModalProps) {
    const [newTask, setNewTask] = useState<NewTask>({
        title: '',
        description: '',
        startDate: new Date().toISOString().slice(0, 10),
        dueDate: new Date().toISOString().slice(0, 10),
        status: 'Sin iniciar',
        priority: 'Baja',
        assignedTo: '',
        projectId: projectId,
        dependencies: [],
        estimatedHours: 0,
        comment: '',
        attachments: [],
        tags: [],
        type: 'Tarea'
    });
    
    const [currentTag, setCurrentTag] = useState('');
    const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);
    const [projectTasks, setProjectTasks] = useState<Task[]>([]);

    // --- LÓGICA PARA NUEVO SELECTOR DE DEPENDENCIAS ---
    const [isDependenciesOpen, setIsDependenciesOpen] = useState(false);
    const [dependencySearchTerm, setDependencySearchTerm] = useState('');
    const dependenciesRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        async function fetchTeamMembers() {
            try {
                const team = await getTeamMembers(projectId);
                setTeamMembers(team);
                if (team.length > 0) {
                    setNewTask(prev => ({...prev, assignedTo: team[0]._id}));
                }
            } catch (error) {
                console.log('Error al obtener los miembros del equipo:', error);
            }
        };
        fetchTeamMembers();
    }, [projectId]);

    useEffect(() => {
        async function fetchProjectTasks() {
            try {
                const tasks = await getProjectTasks(projectId);
                setProjectTasks(tasks);
            } catch (error) {
                console.log('Error al obtener las tareas del proyecto:', error);
            }
        };
        fetchProjectTasks();
    }, [projectId]);
    
    // Click outside handler para cerrar el dropdown de dependencias
    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (dependenciesRef.current && !dependenciesRef.current.contains(event.target as Node)) {
                setIsDependenciesOpen(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [dependenciesRef]);
    
    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setNewTask(prev => ({ ...prev, [name]: value }));
    }
    
    // --- FUNCIONES PARA NUEVO SELECTOR DE DEPENDENCIAS ---
    const addDependency = (taskId: string) => {
        if (!newTask.dependencies.includes(taskId)) {
            setNewTask(prev => ({ ...prev, dependencies: [...prev.dependencies, taskId] }));
        }
        setDependencySearchTerm('');
        setIsDependenciesOpen(false);
    };

    const removeDependency = (taskId: string) => {
        setNewTask(prev => ({ ...prev, dependencies: prev.dependencies.filter(id => id !== taskId) }));
    };
    
    const availableTasks = projectTasks.filter(task => 
        !newTask.dependencies.includes(task._id) && 
        task.title.toLowerCase().includes(dependencySearchTerm.toLowerCase())
    );

    const handleTagKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter' && currentTag.trim() !== '') {
            e.preventDefault();
            if (!newTask.tags.includes(currentTag.trim())) {
                setNewTask(prev => ({ ...prev, tags: [...prev.tags, currentTag.trim()] }));
            }
            setCurrentTag('');
        }
    }

    const removeTag = (tagToRemove: string) => {
        setNewTask(prev => ({ ...prev, tags: prev.tags.filter(tag => tag !== tagToRemove) }));
    }

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onAddTask(newTask);
    }

    return (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 transition-opacity duration-300">
            <div className="bg-gray-50 p-8 rounded-xl shadow-2xl w-full max-w-3xl max-h-[90vh] overflow-y-auto">
                <h2 className="text-2xl font-bold mb-6 text-gray-800 border-b pb-4">Agregar Nueva Tarea</h2>
                <form onSubmit={handleSubmit} className="space-y-4">

                    {/* Título y Descripción */}
                    <div>
                        <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">Título de la Tarea</label>
                        <input type="text" id="title" name="title" value={newTask.title} onChange={handleChange} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:ring-indigo-500 focus:border-indigo-500" required />
                    </div>
                    <div>
                        <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">Descripción</label>
                        <textarea id="description" name="description" value={newTask.description} onChange={handleChange} rows={3} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:ring-indigo-500 focus:border-indigo-500" />
                    </div>

                    {/* Fechas */}
                    <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
                        <div>
                            <label htmlFor="startDate" className="block text-sm font-medium text-gray-700 mb-1">Fecha de Inicio</label>
                            <input type="date" id="startDate" name="startDate" value={newTask.startDate} onChange={handleChange} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3" />
                        </div>
                        <div>
                            <label htmlFor="dueDate" className="block text-sm font-medium text-gray-700 mb-1">Fecha Límite</label>
                            <input type="date" id="dueDate" name="dueDate" value={newTask.dueDate} onChange={handleChange} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3" />
                        </div>
                    </div>

                    {/* Estado y Prioridad */}
                    <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
                        <div>
                            <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-1">Estado</label>
                            <select name="status" value={newTask.status} onChange={handleChange} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3" required>
                                {taskStatuses.map(status => <option key={status} value={status}>{status}</option>)}
                            </select>
                        </div>
                        <div>
                            <label htmlFor="priority" className="block text-sm font-medium text-gray-700 mb-1">Prioridad</label>
                            <select name="priority" value={newTask.priority} onChange={handleChange} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3" required>
                                {taskPriorities.map(priority => <option key={priority} value={priority}>{priority}</option>)}
                            </select>
                        </div>
                    </div>

                     {/* Asignado y Tipo */}
                    <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
                        <div>
                            <label htmlFor="assignedTo" className="block text-sm font-medium text-gray-700 mb-1">Asignar a</label>
                            <select name="assignedTo" value={newTask.assignedTo} onChange={handleChange} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3">
                                <option value="">Sin asignar</option>
                                {teamMembers.map(user => <option key={user._id} value={user._id}>{user.name}</option>)}
                            </select>
                        </div>
                         <div>
                            <label htmlFor="type" className="block text-sm font-medium text-gray-700 mb-1">Tipo</label>
                            <select name="type" value={newTask.type} onChange={handleChange} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3" required>
                                {type.map(t => <option key={t} value={t}>{t}</option>)}
                            </select>
                        </div>
                    </div>
                    
                    {/* FIX 2: Nuevo componente para seleccionar dependencias */}
                    <div className="relative" ref={dependenciesRef}>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Dependencias</label>
                        <div className="mt-1 flex flex-wrap items-center gap-2 p-2 border border-gray-300 rounded-md shadow-sm min-h-[42px] bg-white">
                            {newTask.dependencies.map(depId => {
                                const task = projectTasks.find(t => t._id === depId);
                                return task ? (
                                    <span key={depId} className="flex items-center gap-1.5 bg-blue-100 text-blue-800 text-sm font-medium px-2 py-1 rounded-full">
                                        {task.title}
                                        <button type="button" onClick={() => removeDependency(depId)} className="text-blue-600 hover:text-blue-900 focus:outline-none font-bold">&times;</button>
                                    </span>
                                ) : null;
                            })}
                            <input
                                type="text"
                                value={dependencySearchTerm}
                                onChange={(e) => setDependencySearchTerm(e.target.value)}
                                onFocus={() => setIsDependenciesOpen(true)}
                                placeholder="Buscar tareas para agregar..."
                                className="flex-grow bg-transparent focus:outline-none p-1"
                            />
                        </div>
                        {isDependenciesOpen && availableTasks.length > 0 && (
                            <ul className="absolute z-10 mt-1 w-full bg-white shadow-lg max-h-56 rounded-md py-1 text-base ring-1 ring-black ring-opacity-5 overflow-auto focus:outline-none sm:text-sm">
                                {availableTasks.map(task => (
                                    <li key={task._id} onClick={() => addDependency(task._id)} className="text-gray-900 cursor-pointer select-none relative py-2 px-4 hover:bg-indigo-600 hover:text-white">
                                        <span className="font-normal block truncate">{task.title}</span>
                                    </li>
                                ))}
                            </ul>
                        )}
                    </div>



                    <div>
                        <label htmlFor="tags" className="block text-sm font-medium text-gray-700 mb-1">Etiquetas (presiona Enter para agregar)</label>
                        <div className="mt-1 flex flex-wrap items-center gap-2 p-2 border border-gray-300 rounded-md shadow-sm bg-white">
                            {newTask.tags.map(tag => (
                                <span key={tag} className="flex items-center gap-1 bg-indigo-100 text-indigo-700 text-sm font-medium px-2 py-1 rounded-full">
                                    {tag}
                                    <button type="button" onClick={() => removeTag(tag)} className="text-indigo-500 hover:text-indigo-800 focus:outline-none">&times;</button>
                                </span>
                            ))}
                            <input type="text" id="tags" value={currentTag} onChange={(e) => setCurrentTag(e.target.value)} onKeyDown={handleTagKeyDown} className="flex-grow bg-transparent focus:outline-none p-1" placeholder={newTask.tags.length === 0 ? "Ej: Diseño, Frontend, Urgente" : ""} />
                        </div>
                    </div>
                    
                    <div className="flex justify-end gap-4 mt-8 pt-4 border-t">
                        <button type="button" onClick={onClose} className="px-4 py-2 rounded-md border bg-white text-gray-700 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500">Cancelar</button>
                        <button type="submit" className="px-6 py-2 rounded-md bg-indigo-600 text-white font-semibold hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">Crear Tarea</button>
                    </div>
                </form>
            </div>
        </div>
    );
}

