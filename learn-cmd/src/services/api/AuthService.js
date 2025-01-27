import apiClient from './apiClient';

export default {
  async register(userData) {
    try {
      const response = await apiClient.post('/auth/register', userData);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: error.message };
    }
  },

  async login(credentials) {
    try {
      const response = await apiClient.post('/auth/login', credentials);
      if (response.data.access_token) {
        localStorage.setItem('token', response.data.access_token);
      }
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: error.message };
    }
  },

  async logout() {
    try {
      const response = await apiClient.post('/auth/logout');
      localStorage.removeItem('token');
      return response.data;
    } catch (error) {
      localStorage.removeItem('token');
      throw error.response?.data || { message: error.message };
    }
  }
};
