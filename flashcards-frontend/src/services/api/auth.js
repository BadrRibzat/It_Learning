import axiosInstance from './axios';
import { API_ENDPOINTS } from '@/config';

const authService = {
  login: async (credentials) => {
    const response = await axiosInstance.post(API_ENDPOINTS.AUTH.LOGIN, credentials);
    if (response.data.access) {
      localStorage.setItem('token', response.data.access);
      localStorage.setItem('refreshToken', response.data.refresh);
      axiosInstance.defaults.headers.common['Authorization'] = `Bearer ${response.data.access}`;
    }
    return response.data;
  },

  register: async (userData) => {
    const response = await axiosInstance.post(API_ENDPOINTS.AUTH.REGISTER, userData);
    return response.data;
  },

  logout: async () => {
    const response = await axiosInstance.post(API_ENDPOINTS.AUTH.LOGOUT);
    localStorage.removeItem('token');
    localStorage.removeItem('refreshToken');
    delete axiosInstance.defaults.headers.common['Authorization'];
    return response;
  },

  refreshToken: async () => {
    const refresh = localStorage.getItem('refreshToken');
    if (!refresh) throw new Error('No refresh token available');
    
    const response = await axiosInstance.post(API_ENDPOINTS.AUTH.REFRESH_TOKEN, {
      refresh: refresh
    });
    
    if (response.data.access) {
      localStorage.setItem('token', response.data.access);
      axiosInstance.defaults.headers.common['Authorization'] = `Bearer ${response.data.access}`;
    }
    
    return response;
  }
};

export default authService;
