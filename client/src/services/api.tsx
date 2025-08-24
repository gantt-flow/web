'use client';

import axios from 'axios';

// Variable definida en .env.local
const baseURL = process.env.NEXT_PUBLIC_BACKEND_URL;

if (!baseURL) {
  throw new Error('La variable de entorno NEXT_PUBLIC_BACKEND_URL no está definida.');
}

// Crea una instancia de Axios con una configuración base
const api = axios.create({
  baseURL: baseURL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true // Permite enviar cookies con las solicitudes
});


// Interceptor para manejar las respuestas de la API
api.interceptors.response.use(
  // La primera función se ejecuta para respuestas exitosas (código 2xx)
  (response) => {
    // Si la respuesta es exitosa, simplemente la retornamos sin hacer nada.
    return response;
  },
  // La segunda función se ejecuta para respuestas con error
  (error) => {
    // Verificamos si el error tiene una respuesta del servidor y un código de estado
    if (error.response && error.response.status === 401) {
      // Si el código es 401 (No autorizado), significa que el token no es válido o ha expirado.
    
      // Verificamos que no estemos ya en una página pública para evitar bucles de redirección.
      if (typeof window !== 'undefined' && window.location.pathname !== '/auth/login') {
        console.error("Sesión expirada o no autorizada. Redirigiendo al inicio...");
        
        // Redirigimos al usuario a la página de inicio.
        // El servidor ya considera la sesión inválida. Lo importante es sacar al usuario de la vista protegida.
        window.location.href = '/auth/login'; 
      }
    }
    
    // Para cualquier otro error, simplemente lo rechazamos para que el
    // bloque .catch() del código que hizo la llamada original pueda manejarlo.
    return Promise.reject(error);
  }
);


export default api;