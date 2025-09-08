import api from '@/services/api';
import { User } from './userService';
import { NewProject } from './projectService';
import { Comment } from './commentsService';

export interface Task {
    _id: string;
    title: string;
    description: string;
    startDate: Date;
    dueDate: Date;
    endDate: Date;
    status: string;
    priority: string;
    assignedTo: User;
    projectId: NewProject;
    dependencies?: string[];
    estimatedHours: number;
    actualHours: number;
    createdBy: User;
    createdAt?: Date;
    updatedAt?: Date;
    comments: Comment[];
    attachments?: string[];
    tags: string[];
    type: string;
}


export const getTasksByProject = async (projectId: string): Promise<Task[]> => {
    try {
        const response = await api.get<Task[]>(`/tasks/${projectId}`)
        return response.data;
    } catch (error){
        console.error("Error al obtener las tareas", error);
        throw error;
    }
}