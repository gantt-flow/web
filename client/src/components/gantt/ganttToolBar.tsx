'use client'

import { Plus, Filter, Settings, Calendar } from "lucide-react";
import { ViewMode } from "@/app/inicio/gantt/page";

interface GanttToolBarProps {
    viewMode: ViewMode;
    onViewModeChange: (mode: ViewMode) => void;
    onAddTaskClick: () => void;
    onFilterClick: () => void;
    onGoToToday: () => void;
    onSettingsClick: () => void;
}

const viewModes = [
    { label: 'Día', borderClass: 'rounded-l'},
    { label: 'Semana' },
    { label: 'Mes', borderClass: 'rounded-r' }
]


export default function GanttToolBar({ 
    viewMode, 
    onViewModeChange, 
    onAddTaskClick, 
    onFilterClick,
    onGoToToday,
    onSettingsClick 
}: GanttToolBarProps) {
    return(
        <div className="flex items-center justify-between h-full px-4 border-y border-gray-200">

            <div className="flex items-center gap-2">
                <button onClick={onAddTaskClick} className="flex items-center gap-2 px-3 py-1.5 bg-green-500 text-white rounded-md hover:bg-blue-600">
                    <Plus size={16} /> Crear
                </button>
                <button onClick={onFilterClick} className="flex items-center gap-2 px-3 py-1.5 border rounded-md hover:bg-gray-100">
                    <Filter size={16} /> Filtro
                </button>
                <button onClick={onSettingsClick} className="flex items-center gap-2 px-3 py-1.5 border rounded-md hover:bg-gray-100">
                    <Settings size={16} /> Configuración
                </button>          
            </div>

            <div className="flex items-center">
                <button onClick={onGoToToday} className="flex mr-4 items-center gap-2 text-green-500 px-3 py-1.5 border border-green-500 rounded-md hover:bg-gray-100">
                    <Calendar size={16} stroke="currentColor"/> Hoy
                </button>

                {viewModes.map(({label, borderClass}) => (
                    <button key={label} className={`px-4 py-2 border border-green-500 text-green-500 ${borderClass} hover:bg-green-500 hover:text-white cursor-pointer`}>
                        {label}
                    </button>
                ))}         
            </div>
        </div>
        
    )
}