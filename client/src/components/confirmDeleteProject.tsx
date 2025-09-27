'use client';

import { AlertTriangle } from 'lucide-react';

interface ConfirmDeleteProjectModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
    projectName: string;
}

export default function ConfirmDeleteProjectModal({ isOpen, onClose, onConfirm, projectName }: ConfirmDeleteProjectModalProps) {
    if (!isOpen) return null;

    return (
        <div 
            className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 transition-opacity duration-300"
            onClick={onClose}
        >
            <div 
                className="bg-white dark:bg-gray-800 rounded-lg shadow-xl p-6 w-full max-w-md"
                onClick={e => e.stopPropagation()}
            >
                <div className="flex items-start gap-4">
                    <div className="mx-auto flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-red-100 dark:bg-red-900/50 sm:mx-0 sm:h-10 sm:w-10">
                        <AlertTriangle className="h-6 w-6 text-red-600 dark:text-red-400" aria-hidden="true" />
                    </div>
                    <div className="flex-grow">
                        <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100">Confirmar Eliminación de Proyecto</h3>
                        <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                            ¿Estás seguro de que quieres eliminar este proyecto permanentemente? Todas las tareas y datos asociados se perderán.
                            <br />
                            <strong className="font-semibold">"{projectName}"</strong>
                        </p>
                    </div>
                </div>
                <div className="mt-6 flex justify-end gap-3">
                    <button
                        onClick={onClose}
                        className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600 transition-colors"
                    >
                        Cancelar
                    </button>
                    <button
                        onClick={onConfirm}
                        className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-md hover:bg-red-700 dark:bg-red-500 dark:hover:bg-red-600 transition-colors"
                    >
                        Eliminar Proyecto
                    </button>
                </div>
            </div>
        </div>
    );
}
