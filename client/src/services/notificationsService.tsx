import api from '@/services/api';
// Quitamos NewUser y definimos un tipo local para el destinatario poblado
// ya que 'NewUser' no tiene _id y no es lo que devuelve el populate.
interface PopulatedRecipient {
    _id: string;
    name: string;
    email: string;
}

// --- CAMBIO: Interfaz de Notificación Corregida ---
export interface Notification {
    _id: string;
    // Corregido: Es un solo objeto poblado, no un array de NewUser.
    recipientId: PopulatedRecipient; 
    title: string;
    message: string;
    isRead: boolean;
    createdAt: string;
    updatedAt: string;
}
// --- FIN DEL CAMBIO ---


export const getNotificationsByUser = async (): Promise< Notification[]> => {
    try {
        // Esta llamada ahora SÍ funciona gracias a tus rutas de backend actualizadas
        const response = await api.get<Notification[]>(`/notifications`);
        return response.data;
    } catch (error) {
        console.error("Error al obtener las notificationes");
        throw error;
    }
}


export const updateNotificationStatus = async (notificationId: string): Promise< Notification > => {
    try {
        // Esta llamada SÍ funciona gracias a tus rutas de backend actualizadas
        const response = await api.put<Notification>(`/notifications/${notificationId}/read`);
        return response.data;
    } catch (error) {
        console.error("Error al actualizar el estado de la notificación")
        throw error;
    }

}

export const markAllNotificationsAsRead = async (): Promise<{ message: string; count: number }> => {
    try {
        // Esta llamada SÍ funciona gracias a tus rutas de backend actualizadas
        const response = await api.put<{ message: string; count: number }>(`/notifications/read-all`);
        return response.data;
    } catch (error) {
        console.error("Error al marcar todas las notificaciones como leídas");
        throw error;
    }
}