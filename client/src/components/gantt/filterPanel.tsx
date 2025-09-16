// client/src/components/gantt/FilterModal.tsx
'use client';

import { useState, useEffect } from 'react';

// Define la estructura de los filtros
export interface ActiveFilters {
    status: string;
    assignee: string;
    time: string;
    dateRange: { start: string; end: string };
    priority: string;
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

    // --- ESTILOS DE AddTaskModal APLICADOS ---

    // Overlay: bg-black/60 y transiciones
    return (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 transition-opacity duration-300" onClick={onClose}>
            {/* Modal Box: bg-gray-50, p-8, rounded-xl, shadow-2xl, max-w-2xl */}
            <div className="bg-gray-50 p-8 rounded-xl shadow-2xl w-full max-w-2xl" onClick={e => e.stopPropagation()}>
                
                {/* Header: text-2xl, text-gray-800, border-b */}
                <div className="flex justify-between items-center mb-6 border-b pb-4">
                    <h2 className="text-2xl font-bold text-gray-800">Filtrar Tareas</h2>
                    {/* Botón 'x' eliminado para coincidir con el diseño de AddTaskModal */}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    
                    {/* --- Inputs: Aplicando clases de Label e Input/Select --- */}
                    
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Por Estado</label>
                        <select
                            value={filters.status}
                            onChange={(e) => handleChange('status', e.target.value)}
                            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:ring-indigo-500 focus:border-indigo-500 text-black"
                        >
                            <option value="all">Todo</option>
                            <option value="Sin iniciar">Sin iniciar</option>
                            <option value="En progreso">En progreso</option>
                            <option value="Completada">Completada</option>
                            <option value="En espera">En espera</option>
                        </select>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Por Persona</label>
                        <select
                            value={filters.assignee}
                            onChange={(e) => handleChange('assignee', e.target.value)}
                            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:ring-indigo-500 focus:border-indigo-500 text-black"
                        >
                            <option value="all">Cualquier asignado</option>
                            {currentUserId && <option value="me">Asignadas a mí</option>}
                            {projectMembers.map(member => (
                                <option key={member._id} value={member._id}>{member.name}</option>
                            ))}
                        </select>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Por Tiempo</label>
                        <select
                             value={filters.time}
                             onChange={(e) => handleChange('time', e.target.value)}
                             className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:ring-indigo-500 focus:border-indigo-500 text-black"
                        >
                            <option value="all">Cualquier fecha</option>
                            <option value="overdue">Atrasadas</option>
                            <option value="today">Vencen hoy</option>
                            <option value="week">Vencen esta semana</option>
                        </select>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Por Prioridad</label>
                        <select
                            value={filters.priority}
                            onChange={(e) => handleChange('priority', e.target.value)}
                            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:ring-indigo-500 focus:border-indigo-500 text-black"
                        >
                            <option value="all">Todas</option>
                            <option value="low">Baja</option>
                            <option value="medium">Media</option>
                            <option value="high">Alta</option>
                        </select>
                    </div>

                    <div className="md:col-span-2 grid grid-cols-2 gap-4">
                        <div>
                             <label className="block text-sm font-medium text-gray-700 mb-1">Vencimiento Desde</label>
                             <input 
                                type="date"
                                value={filters.dateRange.start}
                                onChange={e => handleDateChange('start', e.target.value)}
                                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 text-black"
                             />
                        </div>
                         <div>
                             <label className="block text-sm font-medium text-gray-700 mb-1">Vencimiento Hasta</label>
                             <input 
                                type="date"
                                value={filters.dateRange.end}
                                onChange={e => handleDateChange('end', e.target.value)}
                                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 text-black"
                             />
                        </div>
                    </div>
                </div>


                {/* Botones de Acción: Estilizados como AddTaskModal (con borde superior) */}
                <div className="flex justify-end gap-4 mt-8 pt-4 border-t">
                    <button
                        onClick={handleReset}
                        className="px-4 py-2 rounded-md border bg-white text-gray-700 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
                    >
                        Limpiar Filtros
                    </button>
                    <button
                        onClick={handleApply}
                        className="px-6 py-2 rounded-md bg-indigo-600 text-white font-semibold hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                    >
                        Aplicar Filtros
                    </button>
                </div>
            </div>
        </div>
    );
};

export default FilterModal;