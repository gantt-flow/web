'use client';

import { useState, useEffect } from "react";
import { CircleUser, Flag, Circle, CircleCheckBig, CircleMinus, X } from "lucide-react";
import { Task } from "@/services/taskService";
import TaskModal from "./taskDetailsModal";


interface GanttTaskListPanelProps {
  tasks: Task[];
  onTaskStatusChange: (taskId: string) => void;
}


export default function GanttTaskListPanel({ tasks, onTaskStatusChange }: GanttTaskListPanelProps) {

  const [selectedTask, setSelectedTask] = useState<Task | null>(null);

  // Efecto para controlar la tecla Escape para cerrar el modal
  useEffect(() => {
    const handleEsc = (event: KeyboardEvent) => {
        if (event.key === 'Escape'){
            setSelectedTask(null);
        }
    };
    window.addEventListener('keydown',handleEsc);
    return () => window.removeEventListener('keydown', handleEsc)
  })

  // Función para determinar el color de la bandera de prioridad
  const getPriorityColor = (priority: string) => {
    switch(priority){
        case 'Alta': return 'text-red-500';
        case 'Media': return 'text-yellow-500';
        case 'Baja': return 'text-gray-700';
        default: return 'text-gray-400';
    }
  };

  // Fuunción para obtener el icon de status correcto
  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'Terminada': return <CircleCheckBig className="text-green-500" stroke="currentColor" />;
      case 'En progreso': return <CircleMinus className="text-blue-500" stroke="currentColor" />;
      case 'Sin iniciar': return <Circle className="text-gray-400" />;
      default: return <Circle className="text-gray-400" />;
    }
  };

  // Función para iterar sobre los status de una tarea cuando se hace click en el icono de estado
  const handleStatusToggle = (taskId: string) => {
    onTaskStatusChange(taskId);
  };

    return(
        <div className="w-full">
            <div className="h-full overflow-auto">
                <table className="text-sm w-full">
                    <thead className="border-b border-b-gray-300 text-gray-700 bg-gray-50 sticky top-0 z-10">
                        <tr>
                            <th scope="col" className="px-3 py-3">

                            </th>
                            <th scope="col" className="px-3 py-3">
                                
                            </th>
                            <th scope="col" className="px-3 py-3">
                                Tarea
                            </th>
                            <th scope="col" className="px-3 py-3">
                                Prioridad
                            </th>
                        </tr>
                    </thead>

                    <tbody>
                        {tasks.map((task) => (
                            <tr key={task._id} className="bg-white border-b border-b-gray-400 dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600">
                                {/* Celda de status */}
                                <td className="px-3 py-4">
                                    <button onClick={() => handleStatusToggle(task._id)} className="flex items-center justify-center cursor-pointer" aria-label={`Change status for ${task.title}`}>
                                        {getStatusIcon(task.status)}
                                    </button>
                                </td>
                                {/* Celda de persona encargada */}
                                <td className="px-3 py-4">
                                    <div className="relative flex items-center justify-center group">
                                        <CircleUser className="text-gray-500 cursor-pointer" />
                                        <div className="absolute bottom-full mb-2 px-3 py-1.5 bg-gray-800 text-white text-xs rounded-md opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
                                            {task.assignedTo.name}
                                            <div className="absolute left-1/2 -translate-x-1/2 top-full w-0 h-0 border-x-4 border-x-transparent border-t-4 border-t-gray-800"></div>
                                        </div>
                                    </div>
                                </td>
                                {/* Celda del nombre de la tarea que se trunca con nombre largo */}
                                <th scope="row" className="px-6 py-4 font-medium text-gray-900 dark:text-white cursor-pointer hover:text-blue-600 dark:hover:text-blue-400" onClick={() => setSelectedTask(task)}>
                                    <div className="truncate" title={task.title} style={{ maxWidth: '153px' }}>
                                        {task.title}
                                    </div>
                                </th>
                                {/* Celda de la prioridad */}
                                <td className="px-6 py-4">
                                    <Flag className={getPriorityColor(task.priority)} />
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            <TaskModal task={selectedTask} onClose={() => setSelectedTask(null)} />
        </div>
    );
}