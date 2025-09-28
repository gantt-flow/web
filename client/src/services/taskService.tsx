import api from '@/services/api';
import { NewUser, User } from './userService';
import { NewProject } from './projectService';
import { Comment } from './commentsService';

export interface Task {
    typeTask: string;
    _id: string;
    title: string;
    description: string;
    startDate: Date;
    dueDate: Date;
    endDate: Date;
    status: string;
    priority: string;
    assignedTo: User | null;
    projectId: NewProject;
    dependencies?: string[];
    estimatedHours: number;
    actualHours: number;
    createdBy: NewUser;
    comments?: Comment[];
    attachments?: string[];
    tags: string[];
    type: string;
}


export interface NewTask {
    title: string;
    description: string;
    startDate: string;
    dueDate: string;
    status: string;
    priority: string;
    assignedTo: string | null;
    projectId: string;
    dependencies: string[];
    estimatedHours: number;
    comment?: string;
    attachments?: string[];
    tags: string[];
    type: string;
    typeTask: string;
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

export const createTask = async( newTask: NewTask): Promise< NewTask > => {
    try {
        const response = await api.post<NewTask>('/tasks', newTask);
        return response.data;
    }catch(error){
        console.error("Error al crear la tarea:", error);
        throw error;
    }
}


export const updatedTask = async(taskId: string, task: Task) => {
    try {
        const response = await api.put(`/tasks/${taskId}`, task);
        return response.data.task;
    }catch(error){
        console.error("Error al crear la tarea:", error);
        throw error;
    }
}

export const deleteTask = async (taskId: string): Promise<void> => {
    try {
        await api.delete(`/tasks/${taskId}`);
    } catch (error) {
        console.error("Error al eliminar la tarea:", error);
        throw error;
    }
};