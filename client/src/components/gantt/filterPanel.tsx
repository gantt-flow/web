'use client';

import { useState, useEffect } from 'react';

// Define la estructura de los filtros
export interface ActiveFilters {
    status: string;
    assignee: string;
    time: string;
    dateRange: { start: string; end: string };
    priority: string;
    hideCompleted: boolean;
}

interface FilterModalProps {
    isOpen: boolean;
    onClose: () => void;
    onApplyFilters: (filters: ActiveFilters) => void;
    currentFilters: ActiveFilters;
    projectMembers: { _id: string; name: string }[];
    currentUserId?: string;
}

const FilterModal = ({ 
    isOpen, 
    onClose, 
    onApplyFilters, 
    currentFilters, 
    projectMembers, 
    currentUserId 
}: FilterModalProps) => {

    const [filters, setFilters] = useState<ActiveFilters>(currentFilters);

    useEffect(() => {
        setFilters(currentFilters);
    }, [currentFilters]);

    if (!isOpen) return null;

    const handleApply = () => {
        onApplyFilters(filters);
        onClose();
    };

    const handleReset = () => {
        const defaultFilters: ActiveFilters = {
            status: 'all',
            assignee: 'all',
            time: 'all',
            dateRange: { start: '', end: '' },
            priority: 'all',
            hideCompleted: false,
        };
        setFilters(defaultFilters);
        onApplyFilters(defaultFilters);
        onClose();
    };

    const handleChange = (field: keyof ActiveFilters, value: string) => {
        setFilters(prev => ({ ...prev, [field]: value }));
    };

     const handleDateChange = (field: 'start' | 'end', value: string) => {
        setFilters(prev => ({
            ...prev,
            dateRange: {
                ...prev.dateRange,
                [field]: value,
            },
            time: 'all' 
        }));
    };

    const handleCheckboxChange = (field: keyof ActiveFilters, value: boolean) => {
        setFilters(prev => ({ ...prev, [field]: value as any }));
    };

    return (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 transition-opacity duration-300" onClick={onClose}>
            <div className="bg-gray-50 dark:bg-gray-800 p-8 rounded-xl shadow-2xl w-full max-w-2xl" onClick={e => e.stopPropagation()}>
                
                <div className="flex justify-between items-center mb-6 border-b pb-4 dark:border-gray-700">
                    <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100">Filtrar Tareas</h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Por Estado</label>
                        <select
                            value={filters.status}
                            onChange={(e) => handleChange('status', e.target.value)}
                            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 bg-white dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200 focus:ring-indigo-500 focus:border-indigo-500"
                        >
                            <option value="all" className="dark:bg-gray-700">Todo</option>
                            <option value="Sin iniciar" className="dark:bg-gray-700">Sin iniciar</option>
                            <option value="En progreso" className="dark:bg-gray-700">En progreso</option>
                            <option value="Completada" className="dark:bg-gray-700">Completada</option>
                            <option value="En espera" className="dark:bg-gray-700">En espera</option>
                        </select>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Por Persona</label>
                        <select
                            value={filters.assignee}
                            onChange={(e) => handleChange('assignee', e.target.value)}
                            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 bg-white dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200 focus:ring-indigo-500 focus:border-indigo-500"
                        >
                            <option value="all" className="dark:bg-gray-700">Cualquier asignado</option>
                            {currentUserId && <option value="me" className="dark:bg-gray-700">Asignadas a mí</option>}
                            {projectMembers.map(member => (
                                <option key={member._id} value={member._id} className="dark:bg-gray-700">{member.name}</option>
                            ))}
                        </select>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Por Tiempo</label>
                        <select
                             value={filters.time}
                             onChange={(e) => handleChange('time', e.target.value)}
                             className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 bg-white dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200 focus:ring-indigo-500 focus:border-indigo-500"
                        >
                            <option value="all" className="dark:bg-gray-700">Cualquier fecha</option>
                            <option value="overdue" className="dark:bg-gray-700">Atrasadas</option>
                            <option value="today" className="dark:bg-gray-700">Vencen hoy</option>
                            <option value="week" className="dark:bg-gray-700">Vencen esta semana</option>
                        </select>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Por Prioridad</label>
                        <select
                            value={filters.priority}
                            onChange={(e) => handleChange('priority', e.target.value)}
                            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 bg-white dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200 focus:ring-indigo-500 focus:border-indigo-500"
                        >
                            <option value="all" className="dark:bg-gray-700">Todas</option>
                            <option value="Baja" className="dark:bg-gray-700">Baja</option>
                            <option value="Media" className="dark:bg-gray-700">Media</option>
                            <option value="Alta" className="dark:bg-gray-700">Alta</option>
                        </select>
                    </div>

                    <div className="md:col-span-2 grid grid-cols-2 gap-4">
                        <div>
                             <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Vencimiento Desde</label>
                             <input 
                                type="date"
                                value={filters.dateRange.start}
                                onChange={e => handleDateChange('start', e.target.value)}
                                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 bg-white dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200"
                             />
                        </div>
                         <div>
                             <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Vencimiento Hasta</label>
                             <input 
                                type="date"
                                value={filters.dateRange.end}
                                onChange={e => handleDateChange('end', e.target.value)}
                                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 bg-white dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200"
                             />
                        </div>
                    </div>

                    <div className="md:col-span-2 border-t pt-6 mt-0 dark:border-gray-700">
                        <div className="relative flex items-start">
                            <div className="flex h-6 items-center">
                                <input
                                    id="hideCompleted"
                                    name="hideCompleted"
                                    type="checkbox"
                                    checked={filters.hideCompleted}
                                    onChange={(e) => handleCheckboxChange('hideCompleted', e.target.checked)}
                                    className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500 dark:bg-gray-900 dark:border-gray-600 dark:checked:bg-indigo-500"
                                />
                            </div>
                            <div className="ml-3 text-sm leading-6">
                                <label htmlFor="hideCompleted" className="font-medium text-gray-700 dark:text-gray-300">
                                    Ocultar tareas completadas
                                </label>
                            </div>
                        </div>
                    </div>

                </div>

                <div className="flex justify-end gap-4 mt-8 pt-4 border-t dark:border-gray-700">
                    <button
                        onClick={handleReset}
                        className="px-4 py-2 rounded-md border bg-white text-gray-700 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600 dark:border-gray-600"
                    >
                        Limpiar Filtros
                    </button>
                    <button
                        onClick={handleApply}
                        className="px-6 py-2 rounded-md bg-indigo-600 text-white font-semibold hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 dark:bg-indigo-500 dark:hover:bg-indigo-600 dark:focus:ring-offset-gray-800"
                    >
                        Aplicar Filtros
                    </button>
                </div>
            </div>
        </div>
    );
};

export default FilterModal;
