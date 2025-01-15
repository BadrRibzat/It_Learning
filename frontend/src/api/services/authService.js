import axiosInstance from '../axios';

export const authService = {
  register: async (userData) => {
    try {
      const response = await axiosInstance.post('register/', userData);
      return response.data;
    } catch (error) {
      throw error.response.data;
    }
  },
  login: async (credentials) => {
    try {
      const response = await axiosInstance.post('login/', credentials);
      return response.data;
    } catch (error) {
      throw error.response.data;
    }
  },
  logout: async () => {
    try {
      const response = await axiosInstance.post('logout/');
      return response.data;
    } catch (error) {
      throw error.response.data;
    }
  },
  fetchUser: async () => {
    try {
      const response = await axiosInstance.get('profile/');
      return response.data;
    } catch (error) {
      throw error.response.data;
    }
  },
};
