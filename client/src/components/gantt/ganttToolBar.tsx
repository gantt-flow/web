'use client'

import { useState, useEffect } from "react";
import { Plus, Filter, Settings, Calendar, ArrowUpDown } from "lucide-react";
import { ViewMode } from "@/app/inicio/gantt/page";
import { getCurrentUser } from '@/services/userService'; 

interface GanttToolBarProps {
    viewMode: ViewMode;
    onViewModeChange: (mode: ViewMode) => void;
    onAddTaskClick: () => void;
    onFilterClick: () => void;
    onSortClick: () => void;
    onGoToToday: () => void;
    onSettingsClick: () => void;
}

const viewModes: { label: ViewMode; borderClass: string }[] = [
    { label: 'Día', borderClass: 'rounded-l-md'},
    { label: 'Semana', borderClass: '' },
    { label: 'Mes', borderClass: 'rounded-r-md' }
]

export default function GanttToolBar({ 
    viewMode, 
    onViewModeChange, 
    onAddTaskClick, 
    onFilterClick,
    onSortClick,
    onGoToToday,
    onSettingsClick 
}: GanttToolBarProps) {
    const [currentUserRole, setCurrentUserRole] = useState<string | null>(null);

    useEffect(() => {
        const fetchUserRole = async () => {
            try {
                const userData = await getCurrentUser();
                setCurrentUserRole(userData.user.role);
            } catch (error) {
                console.error("Error fetching user role:", error);
            }
        };
        fetchUserRole();
    }, []);

    return(
        <div className="flex items-center justify-between h-full px-4 border-y border-gray-200 dark:border-gray-700">
            <div className="flex items-center gap-2">
                {/* Renderizado condicional del botón Crear */}
                {currentUserRole !== 'Cliente' && (
                    <button 
                        onClick={onAddTaskClick} 
                        className="flex items-center gap-2 px-3 py-1.5 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 dark:bg-indigo-500 dark:hover:bg-indigo-600 transition-colors"
                    >
                        <Plus size={16} /> Crear
                    </button>
                )}
                <button onClick={onFilterClick} className="flex items-center gap-2 px-3 py-1.5 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
                    <Filter size={16} /> Filtro
                </button>
                <button onClick={onSortClick} className="flex items-center gap-2 px-3 py-1.5 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
                    <ArrowUpDown size={16} /> Ordenar
                </button>
                <button onClick={onSettingsClick} className="flex items-center gap-2 px-3 py-1.5 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
                    <Settings size={16} /> Configuración
                </button>          
            </div>

            <div className="flex items-center">
                <button onClick={onGoToToday} className="flex mr-4 items-center gap-2 text-indigo-600 dark:text-indigo-400 px-3 py-1.5 border border-indigo-600 dark:border-indigo-400 rounded-md hover:bg-indigo-50 dark:hover:bg-indigo-900/50 transition-colors">
                    <Calendar size={16} stroke="currentColor"/> Hoy
                </button>

                <div className="flex items-center">
                    {viewModes.map(({label, borderClass}) => (
                        <button 
                            key={label}
                            onClick={() => onViewModeChange(label)}
                            className={`
                                px-4 py-1.5 border-y border-indigo-600 dark:border-indigo-400 text-sm font-medium transition-colors
                                ${borderClass}
                                ${label === 'Día' ? 'border-l' : ''}
                                ${label === 'Mes' ? 'border-r' : ''}
                                ${viewMode === label 
                                    ? 'bg-indigo-600 text-white dark:bg-indigo-400 dark:text-gray-900' 
                                    : 'bg-white text-indigo-600 hover:bg-indigo-50 dark:bg-transparent dark:text-indigo-400 dark:hover:bg-indigo-900/50'
                                }
                            `}
                        >
                            {label}
                        </button>
                    ))}         
                </div>
            </div>
        </div>
    )
}