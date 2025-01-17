import axios from 'axios';
import { NotificationService } from '@/utils/NotificationService';

const API_URL = 'http://127.0.0.1:8000/accounts';

const ProfileService = {
  async getProfile(username) {
    try {
      const response = await axios.get(`${API_URL}/profile/${username}/`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('access_token')}` },
      });
      return response.data;
    } catch (error) {
      NotificationService.handleAuthError(error);
      throw error;
    }
  },

  async updateProfile(username, data) {
    try {
      const response = await axios.put(`${API_URL}/profile/${username}/`, data, {
        headers: { Authorization: `Bearer ${localStorage.getItem('access_token')}` },
      });
      NotificationService.showSuccess('Profile updated successfully!');
      return response.data;
    } catch (error) {
      NotificationService.handleAuthError(error);
      throw error;
    }
  },

  async uploadProfilePicture(file) {
    try {
      const formData = new FormData();
      formData.append('profile_picture', file);
      const response = await axios.post(`${API_URL}/upload-profile-picture/`, formData, {
        headers: { Authorization: `Bearer ${localStorage.getItem('access_token')}` },
      });
      NotificationService.showSuccess('Profile picture uploaded successfully!');
      return response.data;
    } catch (error) {
      NotificationService.handleAuthError(error);
      throw error;
    }
  },

  async deleteProfilePicture() {
    try {
      const response = await axios.delete(`${API_URL}/delete-profile-picture/`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('access_token')}` },
      });
      NotificationService.showSuccess('Profile picture deleted successfully!');
      return response.data;
    } catch (error) {
      NotificationService.handleAuthError(error);
      throw error;
    }
  },

  async getStatistics(username) {
    try {
      const response = await axios.get(`${API_URL}/statistics/${username}/`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('access_token')}` },
      });
      return response.data;
    } catch (error) {
      NotificationService.handleAuthError(error);
      throw error;
    }
  },
};

export default ProfileService;
