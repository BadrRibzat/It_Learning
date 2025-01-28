import apiClient from './apiClient';

export default {
  async getProfile() {
    try {
      const response = await apiClient.get('/profile/profile');
      return response.data;
    } catch (error) {
      console.error('Profile fetch error:', error);
      // Return default profile data
      return {
        message: 'Welcome!',
        profile_data: {
          bio: '',
          preferred_language: 'en',
          profile_picture: null,
          user: {
            full_name: 'User',
            email: ''
          }
        },
        statistics: {
          flashcard_progress: [],
          level_progression: {
            current_level: 'beginner',
            next_level: 'intermediate',
            required_score: 0.8,
            unlocked_levels: ['beginner'],
            progress: 0
          }
        }
      };
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
