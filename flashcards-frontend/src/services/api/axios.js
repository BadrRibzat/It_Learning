import axios from 'axios';
import { API_BASE_URL } from '@/config';
import store from '@/store';
import router from '@/router';

const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  }
});

// Global error handler
const handleError = (error) => {
  const errorMessage = error.response?.data?.detail || 'An unexpected error occurred';
  
  // Log the error
  console.error('API Error:', error);

  // Different handling based on error type
  if (error.response) {
    switch (error.response.status) {
      case 400:
        store.dispatch('app/showNotification', {
          message: 'Invalid request. Please check your input.',
          type: 'error'
        });
        break;
      case 401:
        store.dispatch('auth/logout');
        router.push('/login');
        break;
      case 403:
        store.dispatch('app/showNotification', {
          message: 'You do not have permission to perform this action.',
          type: 'error'
        });
        break;
      case 404:
        store.dispatch('app/showNotification', {
          message: 'The requested resource was not found.',
          type: 'error'
        });
        break;
      case 500:
        store.dispatch('app/showNotification', {
          message: 'Server error. Please try again later.',
          type: 'error'
        });
        break;
    }
  }

  return Promise.reject(error);
};

// Request interceptor for adding token
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor
axiosInstance.interceptors.response.use(
  (response) => response,
  handleError
);

export default axiosInstance;
