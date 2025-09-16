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

// Función para convertir objeto a Map
export const objectToMap = (obj: Record<string, boolean>): Map<string, boolean> => {
  const map = new Map<string, boolean>();
  if (obj) {
    Object.entries(obj).forEach(([key, value]) => {
      map.set(key, value);
    });
  }
  return map;
};

// Función para convertir Map a objeto
export const mapToObject = (map: Map<string, boolean>): Record<string, boolean> => {
  const obj: Record<string, boolean> = {};
  if (map) {
    map.forEach((value, key) => {
      obj[key] = value;
    });
  }
  return obj;
};

// Función para normalizar permisos a Map
export const normalizePermissionsToMap = (perms: any): Map<string, boolean> => {
  const permissionsMap = new Map<string, boolean>();
  
  if (perms instanceof Map) {
    return perms;
  }
  
  if (Array.isArray(perms)) {
    // Si es un array de strings, convertir a Map
    perms.forEach((perm: string) => {
      permissionsMap.set(perm, true);
    });
    return permissionsMap;
  }
  
  if (typeof perms === 'object' && perms !== null) {
    // Si es un objeto, convertir a Map
    Object.entries(perms).forEach(([key, value]) => {
      permissionsMap.set(key, Boolean(value));
    });
    return permissionsMap;
  }
  
  return permissionsMap;
};

// Función para normalizar permisos a array de strings (para visualización)
export const normalizePermissionsToArray = (perms: any): string[] => {
  if (Array.isArray(perms)) {
    return perms;
  }
  
  if (perms instanceof Map) {
    const activePermissions: string[] = [];
    perms.forEach((value, key) => {
      if (value) activePermissions.push(key);
    });
    return activePermissions;
  }
  
  if (typeof perms === 'object' && perms !== null) {
    return Object.entries(perms)
      .filter(([_, value]) => Boolean(value))
      .map(([key, _]) => key);
  }
  
  return [];
};


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

//Admin interface getUsers
export const getAllUsers = async (): Promise<User[]> => {
  try {
    const response = await api.get<User[]>('/users');
    return response.data;
  } catch (error) {
    console.error("Error al obtener los usuarios:", error);
    throw error;
  }
};

export const updateUser = async (userId: string, userData: Partial<User>): Promise<User> => {
  try {
    // Convertir Map a objeto antes de enviar
    const dataToSend = {
      ...userData,
      permisions: userData.permisions instanceof Map ? 
        mapToObject(userData.permisions) : userData.permisions
    };

    const response = await api.put<any>(`/users/${userId}`, dataToSend);
    
    // Convertir los permisos de objeto a Map en la respuesta
    return {
      ...response.data,
      permisions: objectToMap(response.data.permisions || {})
    };
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


/**
 * Obtiene todos los datos de un usuario por su ID
 * @param userId El ID del usuario
 * @returns El objeto completo del usuario
 */
export const getUserById = async (userId: string): Promise<User> => {
  try {
    const response = await api.get<User>(`/users/${userId}`);
    // Normalizamos los permisos al cargar
    response.data.permisions = normalizePermissionsToMap(response.data.permisions);
    return response.data;
  } catch (error) {
    console.error(`Error al obtener el usuario ${userId}:`, error);
    throw error;
  }
};