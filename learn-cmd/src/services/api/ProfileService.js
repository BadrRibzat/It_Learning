import apiClient from './apiClient';

export default {
  async getProfile() {
    try {
      const response = await apiClient.get('/profile/profile');
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  async updateProfile(profileData) {
    try {
      const response = await apiClient.put('/profile/update', profileData);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  }
};
