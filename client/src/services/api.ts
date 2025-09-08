// src/services/api.ts
import axios from 'axios';

const api = axios.create({
  baseURL: (import.meta.env.VITE_BACKEND_URL || 'https://it-learning-backend.fly.dev') + '/api', // ✅ NO SPACES
  withCredentials: true,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;
