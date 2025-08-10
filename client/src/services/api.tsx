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
});

export default api;