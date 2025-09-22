'use client';

import { useState } from 'react';
import { X, ArrowDown, ArrowUp } from 'lucide-react';

// Definimos los tipos para las opciones de ordenamiento
export type SortBy = 'createdAt' | 'dueDate' | 'title';
export type SortOrder = 'asc' | 'desc';

export interface SortOptions {
    sortBy: SortBy;
    order: SortOrder;
}

interface SortModalProps {
    isOpen: boolean;
    onClose: () => void;
    onApplySort: (options: SortOptions) => void;
    currentSort: SortOptions;
}

export default function SortModal({ isOpen, onClose, onApplySort, currentSort }: SortModalProps) {
    if (!isOpen) return null;

    const [sortBy, setSortBy] = useState<SortBy>(currentSort.sortBy);
    const [order, setOrder] = useState<SortOrder>(currentSort.order);

    const handleApply = () => {
        onApplySort({ sortBy, order });
    };

    return (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-lg shadow-xl w-full max-w-sm">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-lg font-bold text-gray-800">Ordenar Tareas</h2>
                    <button onClick={onClose} className="text-gray-500 hover:text-gray-800">
                        <X size={24} />
                    </button>
                </div>

                {/* Criterio de Ordenamiento */}
                <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700">Ordenar por</label>
                    <div className="flex flex-col gap-2">
                        <button onClick={() => setSortBy('createdAt')} className={`p-3 rounded-md text-left text-sm border ${sortBy === 'createdAt' ? 'bg-indigo-100 border-indigo-500 text-indigo-800' : 'bg-gray-50 hover:bg-gray-100'}`}>
                            Fecha de Creación
                        </button>
                        <button onClick={() => setSortBy('dueDate')} className={`p-3 rounded-md text-left text-sm border ${sortBy === 'dueDate' ? 'bg-indigo-100 border-indigo-500 text-indigo-800' : 'bg-gray-50 hover:bg-gray-100'}`}>
                            Fecha de Vencimiento
                        </button>
                        <button onClick={() => setSortBy('title')} className={`p-3 rounded-md text-left text-sm border ${sortBy === 'title' ? 'bg-indigo-100 border-indigo-500 text-indigo-800' : 'bg-gray-50 hover:bg-gray-100'}`}>
                            Orden Alfabético (A-Z)
                        </button>
                    </div>
                </div>

                {/* Dirección del Ordenamiento */}
                <div className="mt-4 space-y-2">
                    <label className="block text-sm font-medium text-gray-700">Dirección</label>
                    <div className="grid grid-cols-2 gap-2">
                        <button onClick={() => setOrder('asc')} className={`flex items-center justify-center gap-2 p-3 rounded-md border ${order === 'asc' ? 'bg-indigo-100 border-indigo-500 text-indigo-800' : 'bg-gray-50 hover:bg-gray-100'}`}>
                            <ArrowUp size={16} /> Ascendente
                        </button>
                        <button onClick={() => setOrder('desc')} className={`flex items-center justify-center gap-2 p-3 rounded-md border ${order === 'desc' ? 'bg-indigo-100 border-indigo-500 text-indigo-800' : 'bg-gray-50 hover:bg-gray-100'}`}>
                            <ArrowDown size={16} /> Descendente
                        </button>
                    </div>
                </div>

                {/* Botones de Acción */}
                <div className="flex justify-end gap-3 mt-6">
                    <button onClick={onClose} className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200">
                        Cancelar
                    </button>
                    <button onClick={handleApply} className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700">
                        Aplicar
                    </button>
                </div>
            </div>
        </div>
    );
}