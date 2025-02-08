import axios from '@/utils/axios';
import { AxiosError } from 'axios';
import type { AxiosResponse } from '@/utils/axios';
import { notifyError } from '@/utils/notifications';

import type {
  Achievement,
  ProfileResponse,
  ProfileUpdate,
  ProfileUploadResponse,
  PointsResponse,
  ProgressCircle,
  ActivityFeed,
  LearningStats,
  ProfileSettings
} from '@/types/profile';

const API_URL = '/profile';

class ProfileService {
  static async getProfile(): Promise<ProfileResponse> {
    try {
      const response: AxiosResponse<ProfileResponse> = await axios.get(`${API_URL}/profile`);
      return response.data;
    } catch (error) {
      this.handleError(error, 'Failed to fetch profile');
      throw error;
    }
  }

  static async getStatistics(): Promise<LearningStats> {
    try {
      const response: AxiosResponse<LearningStats> = await axios.get(`${API_URL}/statistics`);
      return response.data;
    } catch (error) {
      this.handleError(error, 'Failed to fetch statistics');
      throw error;
    }
  }

  static async updateProfile(data: ProfileUpdate): Promise<ProfileResponse> {
    try {
      const response: AxiosResponse<ProfileResponse> = await axios.put(`${API_URL}/update`, data);
      return response.data;
    } catch (error) {
      this.handleError(error, 'Failed to update profile');
      throw error;
    }
  }

  static async uploadProfilePicture(file: File): Promise<ProfileUploadResponse> {
    try {
      // Validate file before upload
      this.validateFile(file);

      const formData = new FormData();
      formData.append('file', file);

      const response: AxiosResponse<ProfileUploadResponse> = await axios.post(
        `${API_URL}/upload-picture`,
        formData,
        {
          headers: {
            'Accept': 'application/json',
          }
        }
      );
      
      return response.data;
    } catch (error) {
      console.error('Upload error:', error);
      this.handleError(error, 'Failed to upload profile picture');
      throw error;
    }
  }

  private static validateFile(file: File): void {
    const maxSize = 5 * 1024 * 1024; // 5MB in bytes
    const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/jpg'];

    if (file.size > maxSize) {
      throw new Error('File size exceeds 5MB limit');
    }

    if (!allowedTypes.includes(file.type)) {
      throw new Error('Invalid file type. Only JPEG, PNG, and GIF are allowed');
    }
  }

  static async getPoints(): Promise<PointsResponse> {
    try {
      const response: AxiosResponse<PointsResponse> = await axios.get(`${API_URL}/points`);
      return response.data;
    } catch (error) {
      this.handleError(error, 'Failed to fetch points');
      throw error;
    }
  }

  static async getProgressCircle(): Promise<ProgressCircle> {
    try {
      const response: AxiosResponse<ProgressCircle> = await axios.get(`${API_URL}/progress-circle`);
      return response.data;
    } catch (error) {
      this.handleError(error, 'Failed to fetch progress data');
      throw error;
    }
  }

  static async getActivityFeed(limit = 20, offset = 0): Promise<ActivityFeed> {
    try {
      const response: AxiosResponse<ActivityFeed> = await axios.get(`${API_URL}/activity`, {
        params: { limit, offset }
      });
      return response.data;
    } catch (error) {
      this.handleError(error, 'Failed to fetch activity feed');
      throw error;
    }
  }

  static async getAchievements(): Promise<{ achievements: Achievement[] }> {
    try {
      const response: AxiosResponse<{ achievements: Achievement[] }> = await axios.get(
        `${API_URL}/achievements`
      );
      return response.data;
    } catch (error) {
      this.handleError(error, 'Failed to fetch achievements');
      throw error;
    }
  }

  static async getSettings(): Promise<{ settings: ProfileSettings }> {
    try {
      const response: AxiosResponse<{ settings: ProfileSettings }> = await axios.get(
        `${API_URL}/settings`
      );
      return response.data;
    } catch (error) {
      this.handleError(error, 'Failed to fetch settings');
      throw error;
    }
  }

  static async updateSettings(settings: ProfileSettings): Promise<{ settings: ProfileSettings }> {
    try {
      const response: AxiosResponse<{ settings: ProfileSettings }> = await axios.put(
        `${API_URL}/settings`,
        settings
      );
      return response.data;
    } catch (error) {
      this.handleError(error, 'Failed to update settings');
      throw error;
    }
  }

  static async trackActivity(activityType: string, data: Record<string, unknown>): Promise<void> {
    try {
      await axios.post(`${API_URL}/activity/track`, {
        type: activityType,
        data,
        timestamp: new Date().toISOString()
      });
    } catch (error) {
      this.handleError(error, 'Failed to track activity');
      throw error;
    }
  }

  static async deleteAccount(): Promise<{ message: string }> {
    try {
      const response: AxiosResponse<{ message: string }> = await axios.delete(`${API_URL}/delete`);
      return response.data;
    } catch (error) {
      this.handleError(error, 'Failed to delete account');
      throw error;
    }
  }

  private static handleError(error: unknown, defaultMessage: string): void {
    const errorMessage = this.getErrorMessage(error, defaultMessage);
    notifyError(errorMessage);
  }

  private static getErrorMessage(error: unknown, defaultMessage: string): string {
    if (error instanceof AxiosError) {
      return error.response?.data?.message || error.message || defaultMessage;
    }
    if (error instanceof Error) {
      return error.message;
    }
    return defaultMessage;
  }

  private static validateFile(file: File): void {
    const maxSize = 5 * 1024 * 1024;
    const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/jpg'];

    if (file.size > maxSize) {
      throw new Error('File size exceeds 5MB limit');
    }

    if (!allowedTypes.includes(file.type)) {
      throw new Error('Invalid file type. Only JPEG, PNG and GIF are allowed');
    }
  }
};

export default ProfileService;
