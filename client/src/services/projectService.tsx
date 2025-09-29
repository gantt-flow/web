import api from '@/services/api';
import { User } from './userService';
import { Task } from './taskService';

export interface Projects {
    _id: string;
    name: string;
    description: string;
    startDate: string;
    endDate: string;
    status: string;
    teamMembers: User[];
    projectManager: User;
    tasks: Task[];
}

export interface NewProject {
    _id: string;
    name: string;
    description?: string;
    startDate?: string;
    endDate?: string;
    status?: string;
}


/**
 * Obtiene la lista de todos los proyectos del usuario actual
 * @returns Un array de proyectos del usuario
 */
export const getUserProjects = async (userId: string): Promise<Projects[]> => {
    try {
        const response = await api.get<Projects[]>(`/projects/current/user/${userId}`);
        return response.data;
    }catch (error) {
        console.error("Error al obtener los proyectos del usuario:", error);
        throw error;
    }
}


/**
 * Obtiene toda la información de un proyecto específico por su ID
 * @param projectId El ID del proyecto a obtener
 * @returns El objeto del proyecto
 */
export const getProjectById = async (projectId: string): Promise<Projects> => {
  try {
    const response = await api.get<Projects>(`/projects/${projectId}`);
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
        console.error("Error completo al añadir miembro:", error);
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


/**
 * Crea un nuevo proyecto en la base de datos
 * @param projectData Los datos del nuevo proyecto
 * @returns El objeto del proyecto creado
 */
export const createProject = async (projectData: NewProject): Promise<NewProject> => {
    try {
        const response = await api.post<{ project: NewProject }>('/projects', projectData);
        return response.data.project;
    } catch (error) {
        console.error("Error al crear el proyecto:", error);
        throw error;
    }
};


/**
 * Agrega el project manager a un nuevo proyecto
 * @param projectData Los datos del nuevo proyecto
 * @returns El objeto del proyecto creado
 */
export const addProjectManagerToProject = async (projectId: string) => {
    try {
        const response = await api.post(`/projects/addProjectManagerToProject/${projectId}`);
        return response.data;
    } catch (error) {
        console.error("Error al crear el proyecto:", error);
        throw error;
    }
};

export const updateProject = async (projectId: string, projectData: NewProject) => {
     try {
        const response = await api.put(`/projects/${projectId}`, projectData);
        return response.data;
    } catch (error) {
        console.error("Error al crear el proyecto:", error);
        throw error;
    }
};


export const deleteProject = async (projectId: string) => {
    try {
        const response = await api.delete(`/projects/${projectId}`);
        return response.data;
    } catch (error) {
        console.error("Error al eliminar el proyecto:", error);
        throw error;
    }
}


export const getTeamMembers = async (projectId: string) => {
    try {
        const response = await api.get(`/projects/getTeamMembers/${projectId}`);
        return response.data.teamMembers;
    } catch (error) {
        console.error("Error al eliminar el proyecto:", error);
        throw error;
    }
}

export const getProjectTasks = async (projectId: string) => {
    try {
        const response = await api.get(`/projects/${projectId}/tasks`);
        return response.data;
    } catch (error) {
        console.error("Error al eliminar el proyecto:", error);
        throw error;
    }
}