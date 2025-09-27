'use client';

import { Task } from "@/services/taskService";
import { X } from "lucide-react";


interface TaskModalProps {
    task: Task | null;
    onClose: () => void;
}

export default function TaskModal({ task, onClose }: TaskModalProps): React.ReactElement | null {

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
    const priorityInfo = getPriorityInfo(task.priority);
    const statusInfo = getStatusInfo(task.status);
    const person = task.assignedTo;

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
                <h2 className="text-2xl font-bold mt-2 mb-4 text-gray-900 dark:text-white border-b pb-2">{task.title}</h2>
                <div className="space-y-3 text-base">
                    <p className="text-gray-700 dark:text-gray-300">
                        <strong className="font-semibold">Asignada a: </strong>
                        <span key={person._id}  className={`font-medium`}>{person.name}</span>
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
