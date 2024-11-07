import axiosInstance from './axios';

const authService = {
  login: (credentials) => axiosInstance.post('/login/', credentials),
  register: (userData) => axiosInstance.post('/register/', userData),
  logout: () => axiosInstance.post('/logout/'),
};

export default authService;
