import axiosInstance from '../axios';

export const authService = {
  register: async (userData) => {
    const response = await axiosInstance.post('register/', userData);
    return response.data;
  },
  login: async (credentials) => {
    const response = await axiosInstance.post('login/', credentials);
    return response.data;
  },
  logout: async () => {
    const response = await axiosInstance.post('logout/');
    return response.data;
  },
  fetchUser: async () => {
    const response = await axiosInstance.get('profile/');
    return response.data;
  },
};
