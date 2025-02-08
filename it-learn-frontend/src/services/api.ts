import axios from 'axios';
import { notifyError } from '@/utils/notifications';

export const API_URL = import.meta.env.VITE_APP_API_URL || 'https://it-learn-backend.onrender.com';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  maxContentLength: Infinity,
  maxBodyLength: Infinity,
});

// Request interceptor for API calls
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('access_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    // Handle FormData for file uploads
    if (config.data instanceof FormData) {
      config.headers['Content-Type'] = 'multipart/form-data';
    }

    return config;
  },
  (error) => {
    notifyError('Request error. Please try again.');
    return Promise.reject(error);
  }
);

// Response interceptor for API calls
api.interceptors.response.use(
  (response) => response,
  async (error: any) => {
    const originalRequest = error?.config as any;

    // Handle specific error cases
    if (error.response?.status === 431) {
      notifyError('File size too large or header fields exceed limit');
    }

    // Handle 401 errors (unauthorized)
    if (error.response?.status === 401 && !originalRequest?._retry) {
      originalRequest._retry = true;
      localStorage.removeItem('access_token');
      window.location.href = '/login';
    }

    notifyError('Response error. Please try again.');
    return Promise.reject(error);
  }
);

export default api;
