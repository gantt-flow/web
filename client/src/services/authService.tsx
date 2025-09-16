import api from '@/services/api';
import { jwtDecode } from 'jwt-decode';

// Definimos una interfaz para las credenciales de inicio de sesión
export interface LoginCredentials {
  email: string;
  password: string;
}

export interface SignUpData {
  email: string;
  password: string;
  name: string;
  role: string;
  projectId?: string;
}

export interface ChangePasswordData {
  currentPassword: string;
  newPassword: string;
}


/**
 * Realiza una petición de login al backend.
 * @param credentials El objeto con el email y la contraseña del usuario.
 * @returns Una promesa que resuelve con la respuesta del servidor.
 */
export const login = async (credentials: LoginCredentials) => {
  // Llamada a la API
  const response = await api.post('/auth/login', credentials);
  return response.data;
};


/**
 * Realiza una petición de registro al backend.
 * @param data El objeto con los datos necesarios para el registro.
 */
export const signUp = async (signUpData: SignUpData) => {
  const response = await api.post('auth/signUp', signUpData);
  return response.data;
}

/**
 * Realiza el registro y, si es exitoso, inicia sesión automáticamente.
 * @param signUpData Los datos del nuevo usuario.
 */
export const registerAndLogin = async (signUpData: SignUpData) => {
  // 1. Llama al servicio de registro
  await signUp(signUpData);
  
  // 2. Si el registro es exitoso, usa las mismas credenciales para iniciar sesión automáticamente
  const credentials = {
    email: signUpData.email,
    password: signUpData.password,
  };
  await login(credentials);
};

export const logout = async () => {
  await api.post('/auth/logout');
};


/**
 * Realiza una petición segura de cambio de contraseña
 * @param data Objeto con la contraseña actual y la nueva
 */
export const changePassword = async (data: ChangePasswordData) => {
    try {
        const response = await api.post('/auth/change-password', data);
        return response.data;
    } catch (error) {
        // Lanza el error para que el componente de la UI pueda atraparlo
        throw error;
    }
};
