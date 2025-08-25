import api from '@/services/api';
import { User } from './userService';

// Definimos una interfaz para los datos del proyecto del usuario actual
export interface UserProjects {
    _id: string;
    name: string;
    description: string;
    startDate: string;
    endDate: string;
    status: string;
    teamMembers: User[];
    projectManager: User;
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


/**
 * Obtiene un proyecto específico por su ID
 * @param projectId El ID del proyecto a obtener
 * @returns El objeto del proyecto
 */
export const getProjectById = async (projectId: string): Promise<UserProjects> => {
  try {
    const response = await api.get<UserProjects>(`/projects/${projectId}`);
    return response.data;
  } catch (error) {
    console.error(`Error al obtener el proyecto ${projectId}:`, error);
    throw error;
  }
};

export const addMember = async (projectId: string, email: string): Promise<User[]> => {
    try {
        const response = await api.post<User[]>(`/projects/${projectId}/members`, { email });
        return response.data;
    } catch (error) {
        console.error("Error al añadir miembro:", error);
        throw error;
    }
};

export const removeMember = async (projectId: string, memberId: string): Promise<void> => {
    try {
        await api.delete(`/projects/${projectId}/members/${memberId}`);
    } catch (error) {
        console.error("Error al eliminar miembro:", error);
        throw error;
    }
};