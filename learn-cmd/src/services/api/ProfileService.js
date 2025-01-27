import apiClient from './apiClient';

export default {
  async getProfile() {
    try {
      const response = await apiClient.get('/profile/profile');
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: error.message };
    }
  },

  async updateProfile(profileData) {
    try {
      const response = await apiClient.put('/profile/update', {
        bio: profileData.bio,
        preferred_language: profileData.preferred_language,
        profile_picture: profileData.profile_picture
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: error.message };
    }
  },

  async deleteAccount() {
    try {
      const response = await apiClient.delete('/auth/delete');
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: error.message };
    }
  }
};
