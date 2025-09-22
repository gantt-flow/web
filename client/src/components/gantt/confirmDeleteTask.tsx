'use client';

interface ConfirmDeleteModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
    taskTitle: string;
}

export default function ConfirmDeleteModal({ isOpen, onClose, onConfirm, taskTitle }: ConfirmDeleteModalProps) {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 transition-opacity duration-300">
            <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-md">
                <h3 className="text-lg font-bold text-gray-900">Confirmar Eliminación</h3>
                <p className="mt-2 text-sm text-gray-600">
                    ¿Estás seguro de que quieres eliminar la tarea permanentemente?
                    <br />
                    <strong className="font-semibold">"{taskTitle}"</strong>
                </p>
                <div className="mt-6 flex justify-end gap-3">
                    <button
                        onClick={onClose}
                        className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200"
                    >
                        Cancelar
                    </button>
                    <button
                        onClick={onConfirm}
                        className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-md hover:bg-red-700"
                    >
                        Eliminar Tarea
                    </button>
                </div>
            </div>
        </div>
    );
}