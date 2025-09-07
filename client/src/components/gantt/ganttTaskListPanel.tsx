'use client';

import { useState, useEffect } from "react";
import { CircleUser, Flag, Circle, CircleCheckBig, CircleMinus, X } from "lucide-react";


// Interfaces for the modal
type Task = {
    id: number;
    name: string;
    person: string;
    prioridad: string;
    status: string;
};

interface TaskModalProps {
    task: Task | null;
    onClose: () => void;
}

const TaskModal = ({ task, onClose }: TaskModalProps) => {
    if (!task) return null;

    // Switch para definir color del texto de la prioridad según el caso
    const getPriorityInfo = (priority:string) => {
        switch(priority){
            case 'Alta': return { text: 'Alta', color: 'text-red-500'};
            case 'Media': return { text: 'Media', color: 'text-yellow-500'};
            case 'Baja': return { text: 'Baja', color: 'text-gray-700'};
            default: return { text: 'N/A', color: 'text-gray-400'};
        }
    };

    // Switch para definir el color del texto del status de la tarea según el caso
    const getStatusInfo = (status:string) => {
        switch (status) {
            case 'Terminada': return { text: 'Terminada', color: 'text-green-500'};
            case 'En progreso': return { text: 'En progreso', color: 'text-blue-500'};
            case 'Sin iniciar': return { text: 'Sin iniciar', color: 'text-gray-500'};
            default: return { text: 'N/A', color: 'text-gray-400'};
        }
    };

    // Se setean las constantes
    const priorityInfo = getPriorityInfo(task.prioridad);
    const statusInfo = getStatusInfo(task.status);
    const person = task.person;

    return(
        //Este primer div define el background y comportamiento
        <div className="fixed inset-0 bg-gray-100/90 flex items-center justify-center z-50">
            {/* Este de aquí define el estilo del modal en sí */}
            <div
                className="bg-white border rounded-lg p-6 w-full max-w-md relative animate-fade-in-up"
                onClick={ e => e.stopPropagation()} //Previene cerrar el modal cuando se hace click dentro
            >
                {/* Botón para cerrar el modal */}
                <button
                    onClick={onClose}
                    className="absolute top-3 right-3 text-gray-400 hover:text-gray-800 dark:hover:text-white transition-colors"
                    arial-label="Close modal"
                >
                    <X size={24}/>
                </button>

                {/* Cuerpo del modal */}
                <h2 className="text-2xl font-bold mt-2 mb-4 text-gray-900 dark:text-white border-b pb-2">{task.name}</h2>
                <div className="space-y-3 text-base">
                    <p className="text-gray-700 dark:text-gray-300">
                        <strong className="font-semibold">Asignada a: </strong>
                        <span className={`font-medium`}>{person}</span>
                    </p>
                    <p className="text-gray-700 dark:text-gray-300">
                        <strong className="font-semibold">Prioridad: </strong>
                        <span className={`font-medium ${priorityInfo.color}`}>{priorityInfo.text}</span>
                    </p>
                    <p className="text-gray-700 dark:text-gray-300 flex items-center gap-2">
                        <strong className="font-semibold">Estado:</strong>
                        <span className={`font-medium ${statusInfo.color}`}>{statusInfo.text}</span>
                    </p>
                </div>
            </div>
        </div>  
    );
}



export default function GanttTaskListPanel() {

  const taskInfo = [
    { id: 1, name: 'Buy PC', person: "Juan", prioridad: "Alta", status: "Terminada" },
    { id: 2, name: 'Setup PC', person: "Pedro", prioridad: "Alta", status: "En progreso"  },
    { id: 3, name: 'Start working on the new project initiative with the marketing team for Q4 launch', person: "Roberto", prioridad: "Media", status: "Sin iniciar"  },
    { id: 4, name: 'Work on report for Q3 financials', person: "Ana", prioridad: "Media", status: "Sin iniciar"  },
    { id: 5, name: 'Send status update to stakeholders', person: "Luis", prioridad: "Baja", status: "Sin iniciar" },
    { id: 6, name: 'Review new design mockups', person: "Maria", prioridad: "Media", status: "En progreso" },
    { id: 7, name: 'Prepare presentation for Friday meeting', person: "Carlos", prioridad: "Alta", status: "Sin iniciar" },
    { id: 8, name: 'Debug login issue on the staging server', person: "Sofia", prioridad: "Alta", status: "En progreso" },
    { id: 9, name: 'Onboard new team member', person: "Juan", prioridad: "Media", status: "Terminada" },
    { id: 10, name: 'Plan team-building activity', person: "Ana", prioridad: "Baja", status: "Sin iniciar" },
    { id: 11, name: 'Update documentation for API endpoints', person: "Pedro", prioridad: "Media", status: "En progreso" },
    { id: 12, name: 'Client call to discuss project milestones', person: "Roberto", prioridad: "Alta", status: "Terminada" },
  ];


  // Estados para controlar tareas and la tarea seleccionada para el modal
  const [tasks, setTasks] = useState(taskInfo);
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
  const handleStatusToggle = (taskId: number) => {
    setTasks(tasks.map(task => {
        if (task.id === taskId) {
            const newStatus = task.status === 'Sin iniciar' ? 'En progreso' : task.status === 'En progreso' ? 'Terminada' : 'Sin iniciar';
            return { ...task, status: newStatus };
        }
        return task;
    }));
  };



    return(
        <div className="w-full">
            <div className="shadow-xl h-[605px] overflow-auto">
                <table className="text-sm">
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
                            <tr key={task.id} className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600">
                                {/* Celda de status */}
                                <td className="px-3 py-4">
                                    <button onClick={() => handleStatusToggle(task.id)} className="flex items-center justify-center cursor-pointer" aria-label={`Change status for ${task.name}`}>
                                        {getStatusIcon(task.status)}
                                    </button>
                                </td>
                                {/* Celda de persona encargada */}
                                <td className="px-3 py-4">
                                    <div className="relative flex items-center justify-center group">
                                        <CircleUser className="text-gray-500 cursor-pointer" />
                                        <div className="absolute bottom-full mb-2 px-3 py-1.5 bg-gray-800 text-white text-xs rounded-md opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
                                            {task.person}
                                            <div className="absolute left-1/2 -translate-x-1/2 top-full w-0 h-0 border-x-4 border-x-transparent border-t-4 border-t-gray-800"></div>
                                        </div>
                                    </div>
                                </td>
                                {/* Celda del nombre de la tarea que se trunca con nombre largo */}
                                <th scope="row" className="px-6 py-4 font-medium text-gray-900 dark:text-white cursor-pointer hover:text-blue-600 dark:hover:text-blue-400" onClick={() => setSelectedTask(task)}>
                                    <div className="truncate" title={task.name} style={{ maxWidth: '153px' }}>
                                        {task.name}
                                    </div>
                                </th>
                                {/* Celda de la prioridad */}
                                <td className="px-6 py-4">
                                    <Flag className={getPriorityColor(task.prioridad)} />
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