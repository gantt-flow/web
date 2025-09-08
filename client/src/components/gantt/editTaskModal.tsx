'use client';

import { useState, useEffect, useRef } from 'react';
import { Task } from '@/services/taskService';
import { getProjectTasks, getTeamMembers } from '@/services/projectService';
import { User } from '@/services/userService';

interface EditTaskModalProps {
    task: Task | null;
    onEditTask: (taskId: string, updateTask: Task) => void | Promise<void>;
    onClose: () => void;
}

// --- CONSTANTS ---
const taskStatuses = ['Sin iniciar', 'En progreso', 'Completada', 'En espera'];
const taskPriorities = ['Baja', 'Media', 'Alta'];
const type = ['Tarea', 'Milestone'];

// --- HELPER FUNCTION ---
const formatDateForInput = (date: string | Date | undefined): string => {
    if (!date) return '';
    const d = new Date(date);
    const year = d.getFullYear();
    const month = (`0${d.getMonth() + 1}`).slice(-2);
    const day = (`0${d.getDate()}`).slice(-2);
    return `${year}-${month}-${day}`;
};

export default function EditTaskModal({ task, onEditTask, onClose }: EditTaskModalProps): React.ReactElement | null {
    if (!task) return null;

    // --- 🚀 FIX #1: Obtener el projectId de forma segura ---
    const projectId = typeof task.projectId === 'string' ? task.projectId : task.projectId?._id;

    const [editTask, setEditTask] = useState<Task>(task);
    const [currentTag, setCurrentTag] = useState('');
    const [teamMembers, setTeamMembers] = useState<User[]>([]);
    const [projectTasks, setProjectTasks] = useState<Task[]>([]);
    const [isDependenciesOpen, setIsDependenciesOpen] = useState(false);
    const [dependencySearchTerm, setDependencySearchTerm] = useState('');
    const dependenciesRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (task) {
            setEditTask(task);
        }
    }, [task]);

    useEffect(() => {
        async function fetchTeamAndTaskData() {
            if (!projectId) return; // Si no hay ID de proyecto, no hacer nada

            try {
                // Obtener miembros del equipo
                const team = await getTeamMembers(projectId);
                setTeamMembers(team);
            } catch (error) {
                console.log('Error al obtener los miembros del equipo:', error);
            }

            try {
                // Obtener las tareas del proyecto
                const tasks = await getProjectTasks(projectId);
                setProjectTasks(tasks);
            } catch (error) {
                console.log('Error al obtener las tareas del proyecto:', error);
            }
        }
        fetchTeamAndTaskData();
    }, [projectId]); // Depender del projectId seguro
    
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
        setEditTask(prev => ({ ...prev, [name]: value }));
    }
    
    const handleAssigneeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const userId = e.target.value;
        const selectedMember = teamMembers.find(member => member._id === userId);
        if (selectedMember) {
            setEditTask(prev => ({ ...prev, assignedTo: selectedMember }));
        }
    };
    
    const addDependency = (taskId: string) => {
        const dependencies = editTask.dependencies ?? [];
        if (!dependencies.includes(taskId)) {
            setEditTask(prev => ({ ...prev, dependencies: [...dependencies, taskId] }));
        }
        setDependencySearchTerm('');
        setIsDependenciesOpen(false);
    };

    const removeDependency = (taskId: string) => {
        setEditTask(prev => ({ ...prev, dependencies: (prev.dependencies ?? []).filter(id => id !== taskId) }));
    };
    
    // --- 🚀 FIX #2: Lógica de filtrado robusta ---
    const availableTasks = projectTasks.filter((pTask: Task) => 
        pTask._id !== task._id && // Excluye la tarea actual que se está editando
        !(editTask.dependencies ?? []).includes(pTask._id) && // Excluye las que ya son dependencias
        pTask.title.toLowerCase().includes(dependencySearchTerm.toLowerCase())
    );

    const handleTagKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter' && currentTag.trim() !== '') {
            e.preventDefault();
            const tags = editTask.tags ?? [];
            if (!tags.includes(currentTag.trim())) {
                setEditTask(prev => ({ ...prev, tags: [...tags, currentTag.trim()] }));
            }
            setCurrentTag('');
        }
    }

    const removeTag = (tagToRemove: string) => {
        setEditTask(prev => ({ ...prev, tags: (prev.tags ?? []).filter(tag => tag !== tagToRemove) }));
    }

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (editTask._id) {
            onEditTask(editTask._id, editTask);
        }
    }

    return (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 transition-opacity duration-300">
            <div className="bg-gray-50 p-8 rounded-xl shadow-2xl w-full max-w-3xl max-h-[90vh] overflow-y-auto">
                <h2 className="text-2xl font-bold mb-6 text-gray-800 border-b pb-4">Editar Tarea</h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                    
                    {/* Título y Descripción */}
                    <div>
                        <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">Título de la Tarea</label>
                        <input type="text" id="title" name="title" value={editTask.title} onChange={handleChange} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:ring-indigo-500 focus:border-indigo-500" required />
                    </div>
                    <div>
                        <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">Descripción</label>
                        <textarea id="description" name="description" value={editTask.description} onChange={handleChange} rows={3} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:ring-indigo-500 focus:border-indigo-500" />
                    </div>

                    {/* Fechas */}
                    <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
                        <div>
                            <label htmlFor="startDate" className="block text-sm font-medium text-gray-700 mb-1">Fecha de Inicio</label>
                            <input type="date" id="startDate" name="startDate" value={formatDateForInput(editTask.startDate)} onChange={handleChange} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3"/>
                        </div>
                        <div>
                            <label htmlFor="dueDate" className="block text-sm font-medium text-gray-700 mb-1">Fecha Límite</label>
                            <input type="date" id="dueDate" name="dueDate" value={formatDateForInput(editTask.dueDate)} onChange={handleChange} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3"/>
                        </div>
                    </div>

                    {/* Estado y Prioridad */}
                    <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
                        <div>
                            <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-1">Estado</label>
                            <select name="status" id="status" value={editTask.status} onChange={handleChange} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3" required>
                                {taskStatuses.map(status => <option key={status} value={status}>{status}</option>)}
                            </select>
                        </div>
                        <div>
                            <label htmlFor="priority" className="block text-sm font-medium text-gray-700 mb-1">Prioridad</label>
                            <select name="priority" id="priority" value={editTask.priority} onChange={handleChange} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3" required>
                                {taskPriorities.map(priority => <option key={priority} value={priority}>{priority}</option>)}
                            </select>
                        </div>
                    </div>
                    
                    {/* Asignado y Tipo */}
                     <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
                        <div>
                            <label htmlFor="assignedTo" className="block text-sm font-medium text-gray-700 mb-1">Asignar a</label>
                            <select name="assignedTo" value={editTask.assignedTo?._id || ''} onChange={handleAssigneeChange} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3">
                                <option value="">Sin asignar</option>
                                {teamMembers.map(user => <option key={user._id} value={user._id}>{user.name}</option>)}
                            </select>
                        </div>
                         <div>
                            <label htmlFor="type" className="block text-sm font-medium text-gray-700 mb-1">Tipo</label>
                            <select name="type" value={editTask.type} onChange={handleChange} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3" required>
                                {type.map(t => <option key={t} value={t}>{t}</option>)}
                            </select>
                        </div>
                    </div>

                    {/* Horas */}
                    <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
                        <div>
                            <label htmlFor="estimatedHours" className="block text-sm font-medium text-gray-700 mb-1">Horas Estimadas</label>
                            <input type="number" id="estimatedHours" name="estimatedHours" value={editTask.estimatedHours || ''} onChange={handleChange} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3"/>
                        </div>
                        <div>
                            <label htmlFor="actualHours" className="block text-sm font-medium text-gray-700 mb-1">Horas Reales</label>
                            <input type="number" id="actualHours" name="actualHours" value={editTask.actualHours || ''} onChange={handleChange} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3"/>
                        </div>
                    </div>
                    
                    {/* Dependencias */}
                    <div className="relative" ref={dependenciesRef}>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Dependencias</label>
                        <div className="mt-1 flex flex-wrap items-center gap-2 p-2 border border-gray-300 rounded-md shadow-sm min-h-[42px] bg-white">
                            {(editTask.dependencies ?? []).map(depId => {
                                const depTask = projectTasks.find(t => t._id === depId);
                                return depTask ? (
                                    <span key={depId} className="flex items-center gap-1.5 bg-blue-100 text-blue-800 text-sm font-medium px-2 py-1 rounded-full">
                                        {depTask.title}
                                        <button type="button" onClick={() => removeDependency(depId)} className="text-blue-600 hover:text-blue-900 focus:outline-none font-bold">&times;</button>
                                    </span>
                                ) : null;
                            })}
                            <input type="text" value={dependencySearchTerm} onChange={(e) => setDependencySearchTerm(e.target.value)} onFocus={() => setIsDependenciesOpen(true)} placeholder="Buscar tareas para agregar..." className="flex-grow bg-transparent focus:outline-none p-1"/>
                        </div>
                        {isDependenciesOpen && availableTasks.length > 0 && (
                            <ul className="absolute z-10 mt-1 w-full bg-white shadow-lg max-h-56 rounded-md py-1 text-base ring-1 ring-black ring-opacity-5 overflow-auto focus:outline-none sm:text-sm">
                                {availableTasks.map(availTask => (
                                    <li key={availTask._id} onClick={() => addDependency(availTask._id)} className="text-gray-900 cursor-pointer select-none relative py-2 px-4 hover:bg-indigo-600 hover:text-white">
                                        <span className="font-normal block truncate">{availTask.title}</span>
                                    </li>
                                ))}
                            </ul>
                        )}
                    </div>

                    {/* Etiquetas */}
                    <div>
                        <label htmlFor="tags" className="block text-sm font-medium text-gray-700 mb-1">Etiquetas (presiona Enter para agregar)</label>
                        <div className="mt-1 flex flex-wrap items-center gap-2 p-2 border border-gray-300 rounded-md shadow-sm bg-white">
                            {(editTask.tags ?? []).map(tag => (
                                <span key={tag} className="flex items-center gap-1 bg-indigo-100 text-indigo-700 text-sm font-medium px-2 py-1 rounded-full">
                                    {tag}
                                    <button type="button" onClick={() => removeTag(tag)} className="text-indigo-500 hover:text-indigo-800 focus:outline-none">&times;</button>
                                </span>
                            ))}
                            <input type="text" id="tags" value={currentTag} onChange={(e) => setCurrentTag(e.target.value)} onKeyDown={handleTagKeyDown} className="flex-grow bg-transparent focus:outline-none p-1" placeholder={(editTask.tags ?? []).length === 0 ? "Ej: Diseño, Frontend, Urgente" : ""}/>
                        </div>
                    </div>
                    
                    {/* Botones */}
                    <div className="flex justify-end gap-4 mt-8 pt-4 border-t">
                        <button type="button" onClick={onClose} className="px-4 py-2 rounded-md border bg-white text-gray-700 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500">Cancelar</button>
                        <button type="submit" className="px-6 py-2 rounded-md bg-indigo-600 text-white font-semibold hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">Guardar Cambios</button>
                    </div>
                </form>
            </div>
        </div>
    );
}