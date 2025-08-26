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
  permisions: string[];
}

// Interfaz para los datos del usuario autenticado
export interface AuthenticatedUser {
  authenticated: boolean;
  user: {
    _id: string;
    name: string;
    email: string;
    role: string;
  }
}

// Interfaz para crear un nuevo usuario
export interface NewUser {
    name: string;
    email: string;
}


/**
 * Obtiene el usuario actualmente autenticado
 * @desc Revisa el estado de autenticacion, regresa datos del usuario si está autenticado
 * Solo muestra datos no sensibles del usuario y no detalles de proyectos, tareas o equipo
 * @returns El objeto del usuario autenticado
 */
export const getCurrentUser = async (): Promise<AuthenticatedUser> => {
  try {
    const response = await api.get<AuthenticatedUser>('/users/current');
    return response.data;
  } catch (error) {
    throw error;
  }
};


/**
 * Crea un nuevo usuario
 * @param newUser Los datos del nuevo usuario
 * @returns El objeto del usuario creado
 */
export const createUser = async (newUser: NewUser): Promise<User> => {
  try {
    const response = await api.post<User>('/users', newUser);
    return response.data;
  } catch (error) {
    console.error("Error al crear el usuario:", error);
    throw error;
  }
};

export const createUserAdmin = async (newUser: NewUser): Promise<User> => {
  try {
    const response = await api.post<User>('/admin', newUser);
    return response.data;
  } catch (error) {
    console.error("Error al crear el usuario:", error);
    throw error;
  }
};

export const updateUser = async (userId: string, userData: Partial<User>): Promise<User> => {
  try {
    const response = await api.put<User>(`/users/${userId}`, userData);
    return response.data;
  } catch (error) {
    console.error(`Error updating user ${userId}:`, error);
    throw error;
  }
};

export const deleteUser = async (userId: string): Promise<void> => {
  try {
    await api.delete(`/users/${userId}`);
  } catch (error) {
    console.error(`Error deleting user ${userId}:`, error);
    throw error;
  }
};