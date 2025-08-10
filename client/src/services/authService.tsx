import api from '@/services/api';

// Definimos una interfaz para las credenciales de inicio de sesión
export interface LoginCredentials {
  email: string;
  password: string;
}

/**
 * Realiza una petición de login al backend.
 * @param credentials El objeto con el email y la contraseña del usuario.
 * @returns Una promesa que resuelve con la respuesta del servidor.
 */
export const login = async (credentials: LoginCredentials) => {
  // Aquí es donde ocurre la llamada a la API
  const response = await api.post('/auth/login', credentials);
  return response.data;
};