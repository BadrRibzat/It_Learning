import axiosInstance from './axios';
import { API_ENDPOINTS } from '@/config';

const authService = {
  login: async (credentials) => {
    const response = await axiosInstance.post(API_ENDPOINTS.AUTH.LOGIN, {
      email: credentials.email,
      password: credentials.password
    });
    return response.data;
  },

  register: async (userData) => {
    const response = await axiosInstance.post(API_ENDPOINTS.AUTH.REGISTER, {
      username: userData.username,
      email: userData.email,
      password: userData.password,
      password_confirmation: userData.password_confirmation
    });
    return response.data;
  },

  logout: () => axiosInstance.post(API_ENDPOINTS.AUTH.LOGOUT, {}, {
    headers: {
      'Authorization': `Bearer ${localStorage.getItem('token')}`
    }
  }),

  refreshToken: () => axiosInstance.post(API_ENDPOINTS.AUTH.REFRESH_TOKEN, {
    refresh: localStorage.getItem('refreshToken')
  }),

  checkUser: (email, password) => axiosInstance.post(API_ENDPOINTS.AUTH.CHECK_USER, {
    email,
    password
  }),
};

export default authService;
