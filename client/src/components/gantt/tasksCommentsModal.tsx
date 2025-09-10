'use client';

import { useState, useEffect } from 'react';
import { Task } from '@/services/taskService';
import { Comment, getCommentsByTask, createComment, updateComment, deleteComment } from '@/services/commentsService';
import { getCurrentUser } from '@/services/userService';
import { X, Send, Trash2, Pencil, Check, Ban, AlertTriangle } from 'lucide-react';




interface TaskCommentsModalProps {
    task: Task;
    onClose: () => void;
}

interface CurrentUser {
    _id: string;
    name: string;
    email: string;
    role: string;
}

export default function TaskCommentsModal({ task, onClose }: TaskCommentsModalProps) {
    const [comments, setComments] = useState<Comment[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [newComment, setNewComment] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [currentUser, setCurrentUser] = useState<CurrentUser | null>(null);

    // --- Estados para la edición ---
    const [editingCommentId, setEditingCommentId] = useState<string | null>(null);
    const [editedText, setEditedText] = useState('');

    // --- Estados para el modal de confirmación de borrado ---
    const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
    const [commentToDeleteId, setCommentToDeleteId] = useState<string | null>(null);

    useEffect(() => {
        const loadInitialData = async () => {
            if (!task) return;
            setIsLoading(true);
            try {
                const [userResponse, fetchedComments] = await Promise.all([
                    getCurrentUser(),
                    getCommentsByTask(task._id)
                ]);
                setCurrentUser(userResponse.user);
                setComments(fetchedComments);
            } catch (error) {
                console.error("No se pudieron cargar los datos iniciales", error);
                setComments([]);
            } finally {
                setIsLoading(false);
            }
        };
        loadInitialData();
    }, [task]);

    const handleSubmitComment = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newComment.trim()) return;
        setIsSubmitting(true);
        try {
            const created = await createComment({ comment: newComment, relatedEntity: task._id });
            setComments(prevComments => [created, ...prevComments]);
            setNewComment('');
        } catch (error) {
            console.error("Error al enviar el comentario", error);
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleEdit = (comment: Comment) => {
        setEditingCommentId(comment._id);
        setEditedText(comment.comment);
    };

    const handleCancelEdit = () => {
        setEditingCommentId(null);
        setEditedText('');
    };

    const handleSaveEdit = async (commentId: string) => {
        if (!editedText.trim()) return;
        setIsSubmitting(true);
        try {
            const updated = await updateComment(commentId, editedText);
            setComments(comments.map(c => c._id === commentId ? updated : c));
            handleCancelEdit();
        } catch (error) {
            console.error("Error al guardar la edición", error);
        } finally {
            setIsSubmitting(false);
        }
    };

    // --- Abre el modal de confirmación ---
    const handleDeleteRequest = (commentId: string) => {
        setCommentToDeleteId(commentId);
        setIsConfirmModalOpen(true);
    };

    // --- Cancela la eliminación ---
    const handleCancelDelete = () => {
        setIsConfirmModalOpen(false);
        setCommentToDeleteId(null);
    };

    // --- Confirma y ejecuta la eliminación ---
    const handleConfirmDelete = async () => {
        if (!commentToDeleteId) return;
        try {
            await deleteComment(commentToDeleteId);
            setComments(comments.filter(c => c._id !== commentToDeleteId));
        } catch (error) {
            console.error("Error al eliminar el comentario", error);
        } finally {
            handleCancelDelete(); // Cierra el modal de confirmación
        }
    };

    const wasEdited = (comment: Comment) => {
        return new Date(comment.updatedAt).getTime() - new Date(comment.createdAt).getTime() > 10000;
    };

    return (
        <>
            <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
                <div className="bg-white p-6 rounded-lg shadow-xl w-full max-w-lg max-h-[80vh] flex flex-col">
                    <div className="flex justify-between items-start border-b pb-3 mb-4">
                        <h2 className="text-xl font-bold text-gray-800 break-words" style={{ maxWidth: 'calc(100% - 30px)' }}>
                            Comentarios: <span className="font-normal">{task.title}</span>
                        </h2>
                        <button onClick={onClose} className="text-gray-500 hover:text-gray-800 flex-shrink-0 ml-4"><X size={24} /></button>
                    </div>
                    <form onSubmit={handleSubmitComment} className="mb-4">
                        <div className="relative">
                            <textarea value={newComment} onChange={(e) => setNewComment(e.target.value)} placeholder="Añade un comentario..." className="w-full p-2 pr-10 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition" rows={3} disabled={isSubmitting} />
                            <button type="submit" disabled={!newComment.trim() || isSubmitting} className="absolute right-2 top-2 p-1.5 rounded-full bg-indigo-600 text-white disabled:bg-gray-300 hover:bg-indigo-700 transition" aria-label="Enviar comentario"><Send size={16} /></button>
                        </div>
                    </form>
                    <div className="flex-grow overflow-y-auto pr-2">
                        {isLoading ? (<p className="text-gray-500">Cargando comentarios...</p>) : comments.length > 0 ? (
                            <ul className="space-y-4">
                                {comments.map((comment) => (
                                    <li key={comment._id} className="flex flex-col p-3 bg-gray-50 rounded-md">
                                        <div className="flex items-center justify-between mb-2">
                                            <p className="font-semibold text-gray-700 text-sm">{comment.userId.name}</p>
                                            <div className="flex items-center gap-3">
                                                {wasEdited(comment) && (<span className="text-xs text-gray-400">(editado)</span>)}
                                                <p className="text-xs text-gray-500">{new Date(comment.createdAt).toLocaleDateString('es-MX', { year: 'numeric', month: 'short', day: 'numeric' })}</p>
                                                {currentUser?._id === comment.userId._id && editingCommentId !== comment._id && (
                                                    <div className="flex gap-2">
                                                        <button onClick={() => handleEdit(comment)} className="text-gray-500 hover:text-indigo-600"><Pencil size={14} /></button>
                                                        <button onClick={() => handleDeleteRequest(comment._id)} className="text-gray-500 hover:text-red-600"><Trash2 size={14} /></button>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                        {editingCommentId === comment._id ? (
                                            <div>
                                                <textarea value={editedText} onChange={(e) => setEditedText(e.target.value)} className="w-full p-2 border border-gray-300 rounded-md text-sm" rows={2}></textarea>
                                                <div className="flex justify-end gap-2 mt-2">
                                                    <button onClick={handleCancelEdit} className="p-1 text-gray-600 hover:bg-gray-200 rounded-full"><Ban size={16} /></button>
                                                    <button onClick={() => handleSaveEdit(comment._id)} className="p-1 text-green-600 hover:bg-green-100 rounded-full"><Check size={16} /></button>
                                                </div>
                                            </div>
                                        ) : (
                                            <p className="text-gray-800 text-sm break-words">{comment.comment}</p>
                                        )}
                                    </li>
                                ))}
                            </ul>
                        ) : (
                            <p className="text-gray-500 text-center mt-4">No hay comentarios para esta tarea. ¡Sé el primero en añadir uno!</p>
                        )}
                    </div>
                </div>
            </div>

            {/* --- Modal de Confirmación de Borrado --- */}
            {isConfirmModalOpen && (
                <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-[60]">
                    <div className="bg-white p-7 rounded-lg shadow-xl w-full max-w-md text-center">
                        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-red-100">
                           <AlertTriangle className="h-6 w-6 text-red-600" />
                        </div>
                        <h3 className="text-lg font-bold text-gray-900 mt-5">Eliminar Comentario</h3>
                        <p className="text-gray-600 mt-2 mb-6 text-sm">¿Estás seguro de que quieres eliminar este comentario? Esta acción no se puede deshacer.</p>
                        <div className="flex justify-center gap-4">
                            <button onClick={handleCancelDelete} className="px-5 py-2 rounded-md font-semibold text-gray-700 bg-gray-100 hover:bg-gray-200 transition-colors">
                                Cancelar
                            </button>
                            <button onClick={handleConfirmDelete} className="px-5 py-2 rounded-md font-semibold text-white bg-red-600 hover:bg-red-700 transition-colors">
                                Eliminar
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}