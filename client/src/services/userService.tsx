import api from '@/services/api';

// Definimos los tipos de datos que esperamos para una mejor seguridad y autocompletado
export interface User {
  isActive: true;
  _id: string;
  name: string;
  email: string;
  role: string;
  password?: string; // Campo para creación
  profilePicture?: string;
  notifications?: boolean;
  theme?: string;
  readOnly?: boolean;
  auditLogAccess?: boolean;
}

export interface NewUser {
    name: string;
    email: string;
}

// Interfaz para los datos del usuario autenticado
export interface AuthenticatedUser {
  authenticated: boolean;
  user: {
    _id: string;
    name: string;
    email: string;
    role: string;
    profilePicture?: string;
    notifications?: boolean;
    theme?: string;
    readOnly?: boolean;
    auditLogAccess?: boolean;
  }
}

/**
 * Obtiene la lista de todos los usuarios
 * @returns Un array de usuarios
 */
export const getAllUsers = async (): Promise<User[]> => {
  try {
    const response = await api.get<User[]>('/users');
    return response.data;
  } catch (error) {
    console.error("Error al obtener los usuarios:", error);
    throw error;
  }
};


// Checks authentication status, returns user data if authenticated
export const getCurrentUser = async (): Promise<AuthenticatedUser> => {
  try {
    const response = await api.get<AuthenticatedUser>('/auth/verify');
    return response.data;
  } catch (error) {
    throw error;
  }
};


/**
 * Obtiene un usuario por su ID
 * @param userId El ID del usuario
 * @returns El objeto del usuario
 */
export const getUserById = async (userId: string): Promise<User> => {
  try {
    const response = await api.get<User>(`/users/${userId}`);
    return response.data;
  } catch (error) {
    console.error(`Error al obtener el usuario ${userId}:`, error);
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