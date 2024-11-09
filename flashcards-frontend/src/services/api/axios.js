// src/services/api/axios.js
import axios from 'axios';
import { API_BASE_URL } from '@/config';
import store from '@/stores';
import router from '@/router';

const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  },
  withCredentials: true
});

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

axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
         // Try to refresh token
      try {
        await store.dispatch('auth/refreshToken');
        // Retry the original request
        const token = localStorage.getItem('token');
        error.config.headers.Authorization = `Bearer ${token}`;
        return axios(error.config);
      } catch (refreshError) {
        // If refresh fails, logout and redirect to login
        await store.dispatch('auth/logout');
        router.push('/auth/login');
      }
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;
