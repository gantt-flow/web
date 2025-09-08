'use client'

import { Plus, ListFilter, Settings } from "lucide-react"

const toolBarItems = [
    { icon: <Plus className="mr-2"/>, label: 'Agregar tarea'},
    { icon: <ListFilter className="mr-2"/>, label: 'Filtro', extraClass: 'mx-8'},
    { icon: <Settings className="mr-2"/>, label: 'Configuración'}
]

const viewModes = [
    { label: 'Día', borderClass: 'rounded-l'},
    { label: 'Semana' },
    { label: 'Mes' },
    { label: '6 meses', borderClass: 'rounded-r' }
]


export default function GanttToolBar() {
    return(
        <div className="flex ml-4 mr-4 justify-between">

        <div className="flex">
            {toolBarItems.map(({icon, label, extraClass}) => (
                <button key={label} className={`flex ${extraClass} px-4 py-2 border border-green-500 text-green-500 rounded hover:bg-green-500 hover:text-white cursor-pointer`}>
                    {icon}
                    {label}
                </button>

            ))}            
        </div>

        <div className="flex">
            <button className="flex px-4 py-2 mr-8 border border-green-500 text-green-500 rounded hover:bg-green-500 hover:text-white cursor-pointer">
                Hoy
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