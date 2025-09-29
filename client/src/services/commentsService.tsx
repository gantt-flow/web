import api from '@/services/api';
import { User } from './userService';

// Asegúrate de tener una interfaz para Comment
export interface Comment {
    _id: string;
    comment: string;
    userId: User;
    relatedEntity: string;
    createdAt: string;
    updatedAt: string;
}

export interface NewComment {
    comment: string;
    relatedEntity: string;
}


export const getCommentsByTask = async (taskId: string): Promise<Comment[]> => {
    try {
        const response = await api.get<Comment[]>(`/comments/task/${taskId}`);
        return response.data;
    } catch (error) {
        console.error("Error al obtener los comentarios de la tarea:", error);
        throw error;
    }
};

export const createComment = async (commentData: NewComment): Promise<Comment> => {
    try {
        const response = await api.post<Comment>('/comments', commentData);
        return response.data;
    } catch (error) {
        console.error("Error al crear el comentario:", error);
        throw error;
    }
};

export const updateComment = async (commentId: string, commentText: string): Promise<Comment> => {
    try {
        const response = await api.put<Comment>(`/comments/${commentId}`, { comment: commentText });
        return response.data;
    } catch (error) {
        console.error("Error al actualizar el comentario:", error);
        throw error;
    }
};

export const deleteComment = async (commentId: string): Promise<void> => {
    try {
        await api.delete(`/comments/${commentId}`);
    } catch (error) {
        console.error("Error al eliminar el comentario:", error);
        throw error;
    }
};