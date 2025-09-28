'use client';

import React, { useMemo, useRef, useEffect, useState, useCallback } from 'react';
import { Task } from '@/services/taskService';
import { getProjectTasks, getTeamMembers } from '@/services/projectService';
import { User } from '@/services/userService';
import { getCurrentUser } from '@/services/userService';
import { predictionService, PredictionResult } from '@/services/mlService';

interface EditTaskModalProps {
    task: Task | null;
    onEditTask: (taskId: string, updateTask: Task) => void | Promise<void>;
    onClose: () => void;
    onInitiateDelete: () => void;
}

const taskStatuses = ['Sin iniciar', 'En progreso', 'Completada', 'En espera'];
const taskPriorities = ['Baja', 'Media', 'Alta'];
const type = ['Tarea', 'Milestone'];

const formatDateForInput = (date: string | Date | undefined): string => {
    if (!date) return '';
    const d = new Date(date);
    const userTimezoneOffset = d.getTimezoneOffset() * 60000;
    const localDate = new Date(d.getTime() - userTimezoneOffset);
    return localDate.toISOString().split('T')[0];
};

export default function EditTaskModal({ task, onEditTask, onClose, onInitiateDelete }: EditTaskModalProps): React.ReactElement | null {
    if (!task) return null;

    const projectId = typeof task.projectId === 'string' ? task.projectId : task.projectId?._id;

    const [editTask, setEditTask] = useState<Task>(task);
    const [currentTag, setCurrentTag] = useState('');
    const [teamMembers, setTeamMembers] = useState<User[]>([]);
    const [projectTasks, setProjectTasks] = useState<Task[]>([]);
    const [currentUserId, setCurrentUserId] = useState<string | null>(null);
    const [isPredicting, setIsPredicting] = useState(false);
    const [predictionError, setPredictionError] = useState<string | null>(null);
    const [predictionOptions, setPredictionOptions] = useState<Array<{label: string; probability: number}>>([]);
    const [isDependenciesOpen, setIsDependenciesOpen] = useState(false);
    const [dependencySearchTerm, setDependencySearchTerm] = useState('');
    const dependenciesRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (task) {
            setEditTask(task);
        }
    }, [task]);

    useEffect(() => {
        async function fetchInitialData() {
            if (!projectId) return;

            try {
                const userData = await getCurrentUser();
                if (userData.authenticated) {
                    setCurrentUserId(userData.user._id);
                }

                const [team, tasks] = await Promise.all([
                    getTeamMembers(projectId),
                    getProjectTasks(projectId)
                ]);
                
                setTeamMembers(team);
                setProjectTasks(tasks);

            } catch (error) {
                console.log('Error al obtener datos iniciales:', error);
            }
        }
        fetchInitialData();
    }, [projectId]);
    
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
    
    const predictTaskType = useCallback(async () => {
        if (!editTask.description?.trim()) {
            setPredictionError('La descripción no puede estar vacía');
            return;
        }

        setIsPredicting(true);
        setPredictionError(null);
        setPredictionOptions([]);

        try {
            const result: PredictionResult = await predictionService.getPrediction(editTask.description);
            let options: Array<{label: string; probability: number}> = [];
            
            if (result.top_predictions && Array.isArray(result.top_predictions)) {
                options = result.top_predictions;
            }
            
            setPredictionOptions(options);
            
            if (options.length > 0) {
                setEditTask(prev => ({ ...prev, typeTask: options[0].label }));
            } else {
                setPredictionError('El modelo no devolvió opciones de predicción');
            }
        } catch (error: any) {
            console.error('Error predicting task type:', error);
            setPredictionError('No se pudo predecir el tipo de tarea. Intenta nuevamente.');
        } finally {
            setIsPredicting(false);
        }
    }, [editTask.description]);
    
    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setEditTask(prev => ({ ...prev, [name]: value }));
        
        if (name === 'description') {
            setPredictionOptions([]);
        }
    }
    
    const handleAssigneeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const userId = e.target.value;
        if (userId === "") {
            // Si se selecciona "Sin asignar", se establece assignedTo en null
            setEditTask(prev => ({ ...prev, assignedTo: null }));
        } else {
            const selectedMember = teamMembers.find(member => member._id === userId);
            if (selectedMember) {
                setEditTask(prev => ({ ...prev, assignedTo: selectedMember }));
            }
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
    
    const availableTasks = projectTasks.filter((pTask: Task) => 
        pTask._id !== task._id &&
        !(editTask.dependencies ?? []).includes(pTask._id) &&
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

    const hasAvailableDependencies = projectTasks.length > 1;

    // Ordenamos la lista de miembros para que el usuario actual aparezca primero
    const sortedTeamMembers = useMemo(() => {
        if (!currentUserId) return teamMembers;
        return [...teamMembers].sort((a, b) => {
            if (a._id === currentUserId) return -1;
            if (b._id === currentUserId) return 1;
            return a.name.localeCompare(b.name);
        });
    }, [teamMembers, currentUserId]);

    return (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 transition-opacity duration-300">
            <div className="bg-gray-50 dark:bg-gray-800 p-8 rounded-xl shadow-2xl w-full max-w-3xl max-h-[90vh] overflow-y-auto">
                <h2 className="text-2xl font-bold mb-6 text-gray-800 dark:text-gray-100 border-b pb-4 dark:border-gray-700">Editar Tarea</h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                    
                    <div>
                        <label htmlFor="title" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Título de la Tarea</label>
                        <input type="text" id="title" name="title" value={editTask.title} onChange={handleChange} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 bg-white dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200 focus:ring-indigo-500 focus:border-indigo-500" required />
                    </div>
                    <div>
                        <label htmlFor="description" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Descripción</label>
                        <div className="flex gap-2">
                            <textarea 
                                id="description" 
                                name="description" 
                                value={editTask.description || ''} 
                                onChange={handleChange} 
                                rows={3} 
                                className="flex-grow mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 bg-white dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200 focus:ring-indigo-500 focus:border-indigo-500" 
                                placeholder="Describe la tarea para predecir su tipo"
                            />
                            <button
                                type="button"
                                onClick={predictTaskType}
                                disabled={isPredicting || !editTask.description?.trim()}
                                className="mt-1 px-4 py-2 h-fit bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed dark:bg-blue-500 dark:hover:bg-blue-600 dark:disabled:bg-gray-500"
                            >
                                {isPredicting ? 'Predeciendo...' : 'Predecir Tipo'}
                            </button>
                        </div>
                        {predictionError && (
                            <p className="text-sm text-red-600 dark:text-red-400 mt-1">{predictionError}</p>
                        )}
                    </div>

                    <div>
                        <label htmlFor="typeTask" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                            Tipo de Tarea
                            {isPredicting && <span className="text-blue-500 dark:text-blue-400 ml-2">(Prediciendo...)</span>}
                        </label>
                        
                        {predictionOptions.length > 0 ? (
                            <div className="space-y-2">
                                <select
                                    id="typeTask"
                                    name="typeTask"
                                    value={editTask.typeTask || ''}
                                    onChange={handleChange}
                                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 bg-white dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200 focus:ring-indigo-500 focus:border-indigo-500"
                                    required
                                >
                                    {predictionOptions.map((pred, index) => (
                                        <option key={index} value={pred.label} className="dark:bg-gray-700">{pred.label} ({(pred.probability * 100).toFixed(1)}%)</option>
                                    ))}
                                </select>
                                <p className="text-xs text-gray-500 dark:text-gray-400">
                                    Selecciona entre las opciones predichas por el modelo
                                </p>
                            </div>
                        ) : (
                            <input
                                type="text"
                                id="typeTask"
                                name="typeTask"
                                value={editTask.typeTask || ''}
                                onChange={handleChange}
                                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 bg-white dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200 focus:ring-indigo-500 focus:border-indigo-500"
                                placeholder="Haz clic en 'Predecir Tipo' para ver las opciones"
                                required
                            />
                        )}
                    </div>

                    <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
                        <div>
                            <label htmlFor="startDate" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Fecha de Inicio</label>
                            <input type="date" id="startDate" name="startDate" value={formatDateForInput(editTask.startDate)} onChange={handleChange} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 bg-white dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200"/>
                        </div>
                        <div>
                            <label htmlFor="dueDate" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Fecha Límite</label>
                            <input type="date" id="dueDate" name="dueDate" value={formatDateForInput(editTask.dueDate)} onChange={handleChange} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 bg-white dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200"/>
                        </div>
                    </div>

                    <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
                        <div>
                            <label htmlFor="status" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Estado</label>
                            <select name="status" id="status" value={editTask.status} onChange={handleChange} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 bg-white dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200" required>
                                {taskStatuses.map(status => <option key={status} value={status} className="dark:bg-gray-700">{status}</option>)}
                            </select>
                        </div>
                        <div>
                            <label htmlFor="priority" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Prioridad</label>
                            <select name="priority" id="priority" value={editTask.priority} onChange={handleChange} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 bg-white dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200" required>
                                {taskPriorities.map(priority => <option key={priority} value={priority} className="dark:bg-gray-700">{priority}</option>)}
                            </select>
                        </div>
                    </div>
                    
                     <div>
                        <label htmlFor="assignedTo" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Asignar a</label>
                        <select name="assignedTo" value={editTask.assignedTo?._id || ''} onChange={handleAssigneeChange} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 bg-white dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200">
                            <option value="" className="dark:bg-gray-700">Sin asignar</option>
                            {sortedTeamMembers.map(user => (
                                <option key={user._id} value={user._id} className="dark:bg-gray-700">
                                    {user.name} {user._id === currentUserId ? '(Yo)' : ''}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div>
                        <label htmlFor="type" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Tipo de actividad</label>
                        <select name="type" value={editTask.type} onChange={handleChange} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 bg-white dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200" required>
                            {type.map(t => <option key={t} value={t} className="dark:bg-gray-700">{t}</option>)}
                        </select>
                    </div>

                    <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
                        <div>
                            <label htmlFor="estimatedHours" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Horas Estimadas</label>
                            <input type="number" id="estimatedHours" name="estimatedHours" min="0" value={editTask.estimatedHours || ''} onChange={handleChange} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 bg-white dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200"/>
                        </div>
                        <div>
                            <label htmlFor="actualHours" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Horas Reales</label>
                            <input type="number" id="actualHours" name="actualHours" min="0" value={editTask.actualHours || ''} onChange={handleChange} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 bg-white dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200"/>
                        </div>
                    </div>
                    
                    <div className="relative" ref={dependenciesRef}>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Dependencias</label>
                        <div className={`mt-1 flex flex-wrap items-center gap-2 p-2 border border-gray-300 rounded-md shadow-sm min-h-[42px] bg-white dark:bg-gray-700 dark:border-gray-600 ${!hasAvailableDependencies ? 'bg-gray-100 dark:bg-gray-700/50' : ''}`}>
                            {(editTask.dependencies ?? []).map(depId => {
                                const depTask = projectTasks.find(t => t._id === depId);
                                return depTask ? (
                                    <span key={depId} className="flex items-center gap-1.5 bg-blue-100 text-blue-800 text-sm font-medium px-2 py-1 rounded-full dark:bg-blue-900/50 dark:text-blue-300">
                                        {depTask.title}
                                        <button type="button" onClick={() => removeDependency(depId)} className="text-blue-600 hover:text-blue-900 focus:outline-none font-bold dark:text-blue-400 dark:hover:text-blue-200">&times;</button>
                                    </span>
                                ) : null;
                            })}
                            <input 
                                type="text" 
                                value={dependencySearchTerm} 
                                onChange={(e) => setDependencySearchTerm(e.target.value)} 
                                onFocus={() => hasAvailableDependencies && setIsDependenciesOpen(true)} 
                                placeholder={hasAvailableDependencies ? "Buscar tareas para agregar..." : "No hay otras tareas para agregar"}
                                className="flex-grow bg-transparent focus:outline-none p-1 dark:text-gray-200 disabled:cursor-not-allowed"
                                disabled={!hasAvailableDependencies}
                            />
                        </div>
                        {isDependenciesOpen && availableTasks.length > 0 && (
                            <ul className="absolute z-10 mt-1 w-full bg-white shadow-lg max-h-56 rounded-md py-1 text-base ring-1 ring-black ring-opacity-5 overflow-auto focus:outline-none sm:text-sm dark:bg-gray-800 dark:ring-gray-600">
                                {availableTasks.map(availTask => (
                                    <li key={availTask._id} onClick={() => addDependency(availTask._id)} className="text-gray-900 cursor-pointer select-none relative py-2 px-4 hover:bg-indigo-600 hover:text-white dark:text-gray-200 dark:hover:bg-indigo-500">
                                        <span className="font-normal block truncate">{availTask.title}</span>
                                    </li>
                                ))}
                            </ul>
                        )}
                    </div>

                    <div>
                        <label htmlFor="tags" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Etiquetas (presiona Enter para agregar)</label>
                        <div className="mt-1 flex flex-wrap items-center gap-2 p-2 border border-gray-300 rounded-md shadow-sm bg-white dark:bg-gray-700 dark:border-gray-600">
                            {(editTask.tags ?? []).map(tag => (
                                <span key={tag} className="flex items-center gap-1 bg-indigo-100 text-indigo-700 text-sm font-medium px-2 py-1 rounded-full dark:bg-indigo-900/50 dark:text-indigo-300">
                                    {tag}
                                    <button type="button" onClick={() => removeTag(tag)} className="text-indigo-500 hover:text-indigo-800 focus:outline-none dark:text-indigo-400 dark:hover:text-indigo-200">&times;</button>
                                </span>
                            ))}
                            <input type="text" id="tags" value={currentTag} onChange={(e) => setCurrentTag(e.target.value)} onKeyDown={handleTagKeyDown} className="flex-grow bg-transparent focus:outline-none p-1 dark:text-gray-200" placeholder={(editTask.tags ?? []).length === 0 ? "Ej: Diseño, Frontend, Urgente" : ""}/>
                        </div>
                    </div>
                    
                    <div className="flex justify-between items-center mt-8 pt-4 border-t dark:border-gray-700">
                        <button
                            type="button"
                            onClick={onInitiateDelete}
                            className="text-sm font-medium text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300 transition-colors"
                        >
                            Eliminar Tarea
                        </button>

                        <div className="flex gap-4">
                            <button 
                                type="button" 
                                onClick={onClose} 
                                className="px-4 py-2 rounded-md border bg-white text-gray-700 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600 dark:border-gray-600"
                            >
                                Cancelar
                            </button>
                            <button 
                                type="submit" 
                                className="px-6 py-2 rounded-md bg-indigo-600 text-white font-semibold hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 dark:bg-indigo-500 dark:hover:bg-indigo-600"
                            >
                                Guardar Cambios
                            </button>
                        </div>
                    </div>
                    
                </form>
            </div>
        </div>
    );
}