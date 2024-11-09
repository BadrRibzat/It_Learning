import axiosInstance from './axios';
import { API_ENDPOINTS } from '@/config';

const authService = {
  login: (credentials) => axiosInstance.post(API_ENDPOINTS.AUTH.LOGIN, credentials),
  register: (userData) => axiosInstance.post(API_ENDPOINTS.AUTH.REGISTER, {
    username: userData.username,
    email: userData.email,
    password: userData.password,
    password_confirmation: userData.password_confirmation
  }),
  logout: () => axiosInstance.post(API_ENDPOINTS.AUTH.LOGOUT),
  checkUser: (email, password) => axiosInstance.post(API_ENDPOINTS.AUTH.CHECK_USER, { email, password }),
  refreshToken: () => axiosInstance.post(API_ENDPOINTS.AUTH.REFRESH_TOKEN, {
    refresh: localStorage.getItem('refreshToken')
  }),
};

export default authService;
