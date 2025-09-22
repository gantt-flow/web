'use client'

import { Plus, Filter, Settings, Calendar, ArrowUpDown } from "lucide-react";
import { ViewMode } from "@/app/inicio/gantt/page";

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
    { label: 'Día', borderClass: 'rounded-l'},
    { label: 'Semana', borderClass: '' },
    { label: 'Mes', borderClass: 'rounded-r' }
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
    return(
        <div className="flex items-center justify-between h-full px-4 border-y border-gray-200">
            <div className="flex items-center gap-2">
                <button onClick={onAddTaskClick} className="flex items-center gap-2 px-3 py-1.5 bg-indigo-600 text-white rounded-md hover:bg-indigo-700">
                    <Plus size={16} /> Crear
                </button>
                <button onClick={onFilterClick} className="flex items-center gap-2 px-3 py-1.5 border rounded-md hover:bg-gray-100">
                    <Filter size={16} /> Filtro
                </button>
                <button onClick={onSortClick} className="flex items-center gap-2 px-3 py-1.5 border rounded-md hover:bg-gray-100">
                    <ArrowUpDown size={16} /> Ordenar
                </button>
                <button onClick={onSettingsClick} className="flex items-center gap-2 px-3 py-1.5 border rounded-md hover:bg-gray-100">
                    <Settings size={16} /> Configuración
                </button>          
            </div>

            <div className="flex items-center">
                <button onClick={onGoToToday} className="flex mr-4 items-center gap-2 text-indigo-600 px-3 py-1.5 border border-indigo-600 rounded-md hover:bg-gray-100">
                    <Calendar size={16} stroke="currentColor"/> Hoy
                </button>

                {/* --- 🚀 MEJORA: Lógica de botones de vista --- */}
                <div className="flex items-center">
                    {viewModes.map(({label, borderClass}) => (
                        <button 
                            key={label}
                            onClick={() => onViewModeChange(label)}
                            className={`
                                px-4 py-1.5 border-y border-indigo-600 text-sm transition-colors
                                ${borderClass}
                                ${label === 'Día' ? 'border-l' : ''}
                                ${label === 'Mes' ? 'border-r' : ''}
                                ${viewMode === label 
                                    ? 'bg-indigo-600 text-white' 
                                    : 'bg-white text-indigo-600 hover:bg-indigo-50'
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