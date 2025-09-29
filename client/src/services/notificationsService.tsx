import api from '@/services/api';

interface PopulatedRecipient {
    _id: string;
    name: string;
    email: string;
}

export interface Notification {
    _id: string;
    recipientId: PopulatedRecipient; 
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

export const markAllNotificationsAsRead = async (): Promise<{ message: string; count: number }> => {
    try {
        const response = await api.put<{ message: string; count: number }>(`/notifications/read-all`);
        return response.data;
    } catch (error) {
        console.error("Error al marcar todas las notificaciones como leídas");
        throw error;
    }
}