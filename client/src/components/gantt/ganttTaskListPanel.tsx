'use client';

import { useState, useEffect } from "react";
import { CircleUser, Flag, Circle, CircleCheckBig, CircleMinus } from "lucide-react";
import { Task } from "@/services/taskService";
import EditTaskModal from "./editTaskModal";

interface GanttTaskListPanelProps {
  tasks: Task[];
  onTaskStatusChange: (taskId: string) => void;
  onTaskUpdate: (taskId: string, updatedTask: Task) => void | Promise<void>;
}

export default function GanttTaskListPanel({ tasks, onTaskStatusChange, onTaskUpdate }: GanttTaskListPanelProps) {
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);

  useEffect(() => {
    const handleEsc = (event: KeyboardEvent) => {
        if (event.key === 'Escape'){
            setSelectedTask(null);
        }
    };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, []);

  // ... (tus funciones helper como getPriorityColor, getStatusIcon, etc. no cambian)
  const getPriorityColor = (priority: string) => {
    switch(priority){
        case 'Alta': return 'text-red-500';
        case 'Media': return 'text-yellow-500';
        case 'Baja': return 'text-green-600';
        default: return 'text-gray-400';
    }
  };
  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'Completada': return <CircleCheckBig className="text-green-500" stroke="currentColor" />;
      case 'En progreso': return <CircleMinus className="text-blue-500" stroke="currentColor" />;
      case 'Sin iniciar': return <Circle className="text-gray-400" />;
      default: return <Circle className="text-gray-400" />;
    }
  };
  const handleStatusToggle = (taskId: string) => {
    onTaskStatusChange(taskId);
  };
  const handleModalClose = () => {
    setSelectedTask(null);
  };
  const handleModalSubmit = async (taskId: string, updatedTaskData: Task) => {
    await onTaskUpdate(taskId, updatedTaskData);
    setSelectedTask(null);
  };

  // --- 🚀 FIX: Estructura simplificada sin scroll interno ---
  return(
    <div className="w-full">
        <table className="w-full text-sm border-collapse table-fixed">
          <thead className="text-gray-700 bg-gray-50 sticky top-0 z-10">
            <tr style={{ height: '60px' }}>
              <th className="px-2 w-12 border-b border-gray-200 font-medium"></th>
              <th className="px-2 w-12 border-b border-gray-200 font-medium"></th>
              <th className="px-3 py-3 text-left border-b border-gray-200 font-medium">Tarea</th>
              <th className="px-3 w-24 text-left border-b border-gray-200 font-medium">Prioridad</th>
            </tr>
          </thead>
          <tbody>
            {tasks.map((task) => (
              <tr 
                key={task._id} 
                className="border-b border-gray-200 hover:bg-gray-50"
                style={{ height: '50px' }}
              >
                <td className="px-2 w-12 text-center">
                  <button onClick={() => handleStatusToggle(task._id)} className="inline-flex items-center justify-center cursor-pointer" aria-label={`Change status for ${task.title}`}>
                    {getStatusIcon(task.status)}
                  </button>
                </td>
                <td className="px-2 w-12 text-center">
                  <div className="relative inline-flex items-center justify-center group">
                    <CircleUser className="text-gray-500 cursor-pointer" />
                    <div className="absolute bottom-full mb-2 px-3 py-1.5 bg-gray-800 text-white text-xs rounded-md opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
                      {task.assignedTo.name}
                      <div className="absolute left-1/2 -translate-x-1/2 top-full w-0 h-0 border-x-4 border-x-transparent border-t-4 border-t-gray-800"></div>
                    </div>
                  </div>
                </td>
                <td 
                  scope="row" 
                  className="px-3 py-1 font-medium text-gray-900 cursor-pointer hover:text-indigo-600" 
                  onClick={() => setSelectedTask(task)}
                >
                  <div className="truncate" title={task.title}>
                    {task.title}
                  </div>
                </td>
                <td className="px-3 w-24">
                  <Flag className={getPriorityColor(task.priority)} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <EditTaskModal 
            task={selectedTask} 
            onEditTask={handleModalSubmit} 
            onClose={handleModalClose} 
        />
    </div>
  );
}