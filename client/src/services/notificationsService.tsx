import api from '@/services/api';
import { NewUser } from './userService';


export interface Notification {
    _id: string;
    recipientId: NewUser[];
    title: string;
    message: string;
    isRead: boolean;
    createdAt: string;
    updatedAt: string;
}


export const getNotificationsByUser = async (): Promise< Notification[]> => {
    try {
        const response = await api.get<Notification[]>(`/notifications`);
        return response.data;
    } catch (error) {
        console.error("Error al obtener las notificationes");
        throw error;
    }
}


export const updateNotificationStatus = async (notificationId: string): Promise< Notification > => {
    try {
        const response = await api.put<Notification>(`/notifications/${notificationId}/read`);
        return response.data;
    } catch (error) {
        console.error("Error al actualizar el estado de la notificación")
        throw error;
    }

}