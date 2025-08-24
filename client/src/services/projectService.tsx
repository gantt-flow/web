import api from '@/services/api';

// Definimos una interfaz para los datos del proyecto del usuario actual
export interface UserProjects {
    _id: string;
    name: string;
    description: string;
    startDate: string;
    endDate: string;
    status: string;
    teamMembers: string[];
    projectManager: string;
    tasks: string[];
}


/**
 * Obtiene la lista de todos los proyectos del usuario actual
 * @returns Un array de proyectos del usuario
 */
export const getUserProjects = async (userId: string): Promise<UserProjects[]> => {
    try {
        const response = await api.get<UserProjects[]>(`/users/current/projects/${userId}`);
        return response.data;
    }catch (error) {
        console.error("Error al obtener los proyectos del usuario:", error);
        throw error;
    }
}