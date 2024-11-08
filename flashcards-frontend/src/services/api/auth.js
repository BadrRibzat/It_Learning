import axiosInstance from './axios';

const authService = {
  login: (credentials) => axiosInstance.post('/login/', credentials),
  register: (userData) => axiosInstance.post('/register/', userData),
  logout: () => axiosInstance.post('/logout/'),
  checkUser: (email, password) => axiosInstance.post('/check-user/', { email, password }),
  refreshToken: () => axiosInstance.post('/token/refresh/', {
    refresh: localStorage.getItem('refreshToken')
  }),
};

export default authService;
