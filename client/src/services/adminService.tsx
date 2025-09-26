import api from '@/services/api';
import { Projects } from './projectService';
import { Task } from './taskService'

// Interfaz de usuario según el backend para obtener todos los usuarios
export interface User {
  isActive: true;
  _id: string;
  name: string;
  email: string;
  password?: string;
  role: string;
  profilePicture?: string;
  twoFactorEnabled?: boolean;
  notifications?: boolean;
  theme?: string;
  readonly?: boolean;
  auditLogAccess?: boolean;
  projectId: Projects[];
  taskId: Task[];
  permisions: Map<string, boolean> | Record<string, boolean> | string[];
}

// Interfaz para crear un nuevo usuario
export interface NewUser {
    name: string;
    email: string;
}

export const createUserAdmin = async (newUser: NewUser): Promise<User> => {
  try {
    const response = await api.post<User>('/admin', newUser);
    return response.data;
  } catch (error) {
    console.error("Error al crear el usuario:", error);
    throw error;
  }
};

//Admin interface getUsers
export const getAllUsers = async (): Promise<User[]> => {
  try {
    const response = await api.get<User[]>('/admin');
    return response.data;
  } catch (error) {
    console.error("Error al obtener los usuarios:", error);
    throw error;
  }
};