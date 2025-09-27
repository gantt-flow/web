'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { NewTask } from '@/services/taskService';
import { getProjectTasks, getTeamMembers } from '@/services/projectService';
import { predictionService, PredictionResult } from '@/services/mlService';

interface AddTaskModalProps {
    onClose: () => void;
    onAddTask: (task: NewTask | any) => void | Promise<void>;
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
const taskTypes = ['Tarea', 'Milestone'];

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
        type: 'Tarea',
        typeTask: '' 
    });
    
    const [currentTag, setCurrentTag] = useState('');
    const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);
    const [projectTasks, setProjectTasks] = useState<Task[]>([]);
    const [isPredicting, setIsPredicting] = useState(false);
    const [predictionError, setPredictionError] = useState<string | null>(null);
    const [predictionOptions, setPredictionOptions] = useState<Array<{label: string; probability: number}>>([]);

    const [isDependenciesOpen, setIsDependenciesOpen] = useState(false);
    const [dependencySearchTerm, setDependencySearchTerm] = useState('');
    const dependenciesRef = useRef<HTMLDivElement>(null);

    const predictTaskType = useCallback(async () => {
        if (!newTask.description.trim()) {
            setPredictionError('La descripción no puede estar vacía');
            return;
        }

        setIsPredicting(true);
        setPredictionError(null);
        setPredictionOptions([]);

        try {
            const result: PredictionResult = await predictionService.getPrediction(newTask.description);
            let options: Array<{label: string; probability: number}> = [];
            
            if (result.top_predictions && Array.isArray(result.top_predictions)) {
                options = result.top_predictions;
            }
            
            setPredictionOptions(options);
            
            if (options.length > 0) {
                setNewTask(prev => ({ ...prev, typeTask: options[0].label }));
            } else {
                setPredictionError('El modelo no devolvió opciones de predicción');
            }
        } catch (error: any) {
            console.error('Error predicting task type:', error);
            setPredictionError('No se pudo predecir el tipo de tarea. Intenta nuevamente.');
        } finally {
            setIsPredicting(false);
        }
    }, [newTask.description]);

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
        
        if (!newTask.typeTask) {
            setPredictionError('Debes seleccionar un tipo de tarea');
            return;
        }

        const taskDataWithLocalDates = {
            ...newTask,
            startDate: new Date(newTask.startDate + 'T00:00:00'),
            dueDate: new Date(newTask.dueDate + 'T00:00:00')
        };

        onAddTask(taskDataWithLocalDates);
    }

    return (
        <div 
            className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 transition-opacity duration-300"
            onClick={onClose}
        >
            <div 
                className="bg-gray-50 dark:bg-gray-800 p-8 rounded-xl shadow-2xl w-full max-w-3xl max-h-[90vh] overflow-y-auto"
                onClick={e => e.stopPropagation()}
            >
                <h2 className="text-2xl font-bold mb-6 text-gray-800 dark:text-gray-100 border-b pb-4 dark:border-gray-700">Agregar Nueva Tarea</h2>
                <form onSubmit={handleSubmit} className="space-y-4">

                    <div>
                        <label htmlFor="title" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Título de la Tarea</label>
                        <input type="text" id="title" name="title" value={newTask.title} onChange={handleChange} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 bg-white dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200 focus:ring-indigo-500 focus:border-indigo-500" required />
                    </div>
                    <div>
                        <label htmlFor="description" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Descripción</label>
                        <div className="flex gap-2">
                            <textarea 
                                id="description" 
                                name="description" 
                                value={newTask.description} 
                                onChange={handleChange} 
                                rows={3} 
                                className="flex-grow mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 bg-white dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200 focus:ring-indigo-500 focus:border-indigo-500" 
                                placeholder="Describe la tarea para predecir su tipo"
                            />
                            <button
                                type="button"
                                onClick={predictTaskType}
                                disabled={isPredicting || !newTask.description.trim()}
                                className="mt-1 px-4 py-2 h-fit bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed dark:bg-blue-500 dark:hover:bg-blue-600 dark:disabled:bg-gray-500"
                            >
                                {isPredicting ? 'Predecindo...' : 'Predecir Tipo'}
                            </button>
                        </div>
                        {predictionError && (
                            <p className="text-sm text-red-600 dark:text-red-400 mt-1">{predictionError}</p>
                        )}
                    </div>

                    <div>
                        <label htmlFor="typeTask" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                            Tipo de Tarea
                            {isPredicting && <span className="text-blue-500 ml-2">(Prediciendo...)</span>}
                        </label>
                        
                        {predictionOptions.length > 0 ? (
                            <div className="space-y-2">
                                <select
                                    id="typeTask"
                                    name="typeTask"
                                    value={newTask.typeTask}
                                    onChange={handleChange}
                                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 bg-white dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200 focus:ring-indigo-500 focus:border-indigo-500"
                                    required
                                >
                                    {predictionOptions.map((pred, index) => (
                                        <option key={index} value={pred.label} className="dark:bg-gray-700">
                                            {pred.label} ({(pred.probability * 100).toFixed(1)}%)
                                        </option>
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
                                value={newTask.typeTask}
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
                            <input type="date" id="startDate" name="startDate" value={newTask.startDate} onChange={handleChange} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 bg-white dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200" />
                        </div>
                        <div>
                            <label htmlFor="dueDate" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Fecha Límite</label>
                            <input type="date" id="dueDate" name="dueDate" value={newTask.dueDate} onChange={handleChange} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 bg-white dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200" />
                        </div>
                    </div>

                    <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
                        <div>
                            <label htmlFor="status" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Estado</label>
                            <select name="status" value={newTask.status} onChange={handleChange} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 bg-white dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200" required>
                                {taskStatuses.map(status => <option key={status} value={status} className="dark:bg-gray-700">{status}</option>)}
                            </select>
                        </div>
                        <div>
                            <label htmlFor="priority" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Prioridad</label>
                            <select name="priority" value={newTask.priority} onChange={handleChange} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 bg-white dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200" required>
                                {taskPriorities.map(priority => <option key={priority} value={priority} className="dark:bg-gray-700">{priority}</option>)}
                            </select>
                        </div>
                    </div>

                    <div>
                        <label htmlFor="assignedTo" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Asignar a</label>
                        <select name="assignedTo" value={newTask.assignedTo} onChange={handleChange} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 bg-white dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200">
                            <option value="">Sin asignar</option>
                            {teamMembers.map(user => <option key={user._id} value={user._id} className="dark:bg-gray-700">{user.name}</option>)}
                        </select>
                    </div>

                    <div>
                        <label htmlFor="type" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Tipo de Actividad</label>
                        <select 
                            id="type" 
                            name="type" 
                            value={newTask.type} 
                            onChange={handleChange} 
                            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 bg-white dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200 focus:ring-indigo-500 focus:border-indigo-500"
                        >
                            {taskTypes.map(type => (
                                <option key={type} value={type} className="dark:bg-gray-700">{type}</option>
                            ))}
                        </select>
                    </div>
                    
                    <div className="relative" ref={dependenciesRef}>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Dependencias</label>
                        <div className="mt-1 flex flex-wrap items-center gap-2 p-2 border border-gray-300 rounded-md shadow-sm min-h-[42px] bg-white dark:bg-gray-700 dark:border-gray-600">
                            {newTask.dependencies.map(depId => {
                                const task = projectTasks.find(t => t._id === depId);
                                return task ? (
                                    <span key={depId} className="flex items-center gap-1.5 bg-blue-100 text-blue-800 text-sm font-medium px-2 py-1 rounded-full dark:bg-blue-900/50 dark:text-blue-300">
                                        {task.title}
                                        <button type="button" onClick={() => removeDependency(depId)} className="text-blue-600 hover:text-blue-900 focus:outline-none font-bold dark:text-blue-400 dark:hover:text-blue-200">&times;</button>
                                    </span>
                                ) : null;
                            })}
                            <input
                                type="text"
                                value={dependencySearchTerm}
                                onChange={(e) => setDependencySearchTerm(e.target.value)}
                                onFocus={() => setIsDependenciesOpen(true)}
                                placeholder="Buscar tareas para agregar..."
                                className="flex-grow bg-transparent focus:outline-none p-1 dark:text-gray-200"
                            />
                        </div>
                        {isDependenciesOpen && availableTasks.length > 0 && (
                            <ul className="absolute z-10 mt-1 w-full bg-white shadow-lg max-h-56 rounded-md py-1 text-base ring-1 ring-black ring-opacity-5 overflow-auto focus:outline-none sm:text-sm dark:bg-gray-800 dark:ring-gray-600">
                                {availableTasks.map(task => (
                                    <li key={task._id} onClick={() => addDependency(task._id)} className="text-gray-900 dark:text-gray-200 cursor-pointer select-none relative py-2 px-4 hover:bg-indigo-600 hover:text-white dark:hover:bg-indigo-500">
                                        <span className="font-normal block truncate">{task.title}</span>
                                    </li>
                                ))}
                            </ul>
                        )}
                    </div>

                    <div>
                        <label htmlFor="tags" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Etiquetas (presiona Enter para agregar)</label>
                        <div className="mt-1 flex flex-wrap items-center gap-2 p-2 border border-gray-300 rounded-md shadow-sm bg-white dark:bg-gray-700 dark:border-gray-600">
                            {newTask.tags.map(tag => (
                                <span key={tag} className="flex items-center gap-1 bg-indigo-100 text-indigo-700 text-sm font-medium px-2 py-1 rounded-full dark:bg-indigo-900/50 dark:text-indigo-300">
                                    {tag}
                                    <button type="button" onClick={() => removeTag(tag)} className="text-indigo-500 hover:text-indigo-800 focus:outline-none dark:text-indigo-400 dark:hover:text-indigo-200">&times;</button>
                                </span>
                            ))}
                            <input 
                                type="text" 
                                id="tags" 
                                value={currentTag} 
                                onChange={(e) => setCurrentTag(e.target.value)} 
                                onKeyDown={handleTagKeyDown} 
                                className="flex-grow bg-transparent focus:outline-none p-1 dark:text-gray-200" 
                                placeholder={newTask.tags.length === 0 ? "Ej: Diseño, Frontend, Urgente" : ""} 
                            />
                        </div>
                    </div>
                    
                    <div className="flex justify-end gap-4 mt-8 pt-4 border-t dark:border-gray-700">
                        <button type="button" onClick={onClose} className="px-4 py-2 rounded-md border bg-white text-gray-700 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600 dark:border-gray-600">Cancelar</button>
                        <button 
                            type="submit" 
                            disabled={!newTask.typeTask}
                            className="px-6 py-2 rounded-md bg-indigo-600 text-white font-semibold hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:bg-gray-400 disabled:cursor-not-allowed dark:bg-indigo-500 dark:hover:bg-indigo-600 dark:disabled:bg-gray-500"
                        >
                            Crear Tarea
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
