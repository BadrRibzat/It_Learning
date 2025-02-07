import axios from '@/utils/axios';
import type {
  ProfileData,
  Achievement,
  PointsHistory,
  LearningStreak,
  Activity,
  ProfileResponse,
  ProfileUpdate,
  ProfileUploadResponse,
  PointsResponse,
  ProgressCircle,
  ActivityFeed,
  LearningStats
} from '@/types/profile';

const API_URL = '/profile';

class ProfileService {
  static async getProfile(): Promise<ProfileResponse> {
    try {
      const response = await axios.get<ProfileResponse>(`${API_URL}/profile`);
      return response.data;
    } catch (error) {
      throw this.handleError(error, 'Failed to fetch profile');
    }
  }

  static async getStatistics(): Promise<LearningStats> {
    try {
      const response = await axios.get<LearningStats>(`${API_URL}/statistics`);
      return response.data;
    } catch (error) {
      throw this.handleError(error, 'Failed to fetch statistics');
    }
  }

  static async updateProfile(data: ProfileUpdate): Promise<ProfileResponse> {
    try {
      const response = await axios.put<ProfileResponse>(`${API_URL}/update`, data);
      return response.data;
    } catch (error) {
      console.error('Error updating profile:', error);
      throw error;
    }
  }

  static async uploadProfilePicture(file: File): Promise<ProfileUploadResponse> {
    try {
      this.validateFile(file);
      // Compress image before upload if it's too large
      let compressedFile = file;
      if (file.size > 1024 * 1024) { // If larger than 1MB
        compressedFile = await this.compressImage(file);
      }

      const formData = new FormData();
      formData.append('file', compressedFile);

      const response = await axios.post<ProfileUploadResponse>(
        `${API_URL}/upload-picture`,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
          maxBodyLength: Infinity,
          maxContentLength: Infinity,
        }
      );
      return response.data;
    } catch (error) {
      console.error('Error uploading profile picture:', error);
      throw error;
    }
  }

  private static async compressImage(file: File): Promise<File> {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.src = URL.createObjectURL(file);
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        if (!ctx) {
          reject(new Error('Could not get canvas context'));
          return;
        }

        // Calculate new dimensions while maintaining aspect ratio
        let width = img.width;
        let height = img.height;
        const maxSize = 800;

        if (width > height) {
          if (width > maxSize) {
            height *= maxSize / width;
            width = maxSize;
          }
        } else {
          if (height > maxSize) {
            width *= maxSize / height;
            height = maxSize;
          }
        }

        canvas.width = width;
        canvas.height = height;
        ctx.drawImage(img, 0, 0, width, height);

        canvas.toBlob(
          (blob) => {
            if (!blob) {
              reject(new Error('Could not compress image'));
              return;
            }
            const compressedFile = new File([blob], file.name, {
              type: 'image/jpeg',
              lastModified: Date.now(),
            });
            resolve(compressedFile);
          },
          'image/jpeg',
          0.7
        );
      };
      img.onerror = reject;
    });
  }

  static async getPoints(): Promise<PointsResponse> {
    try {
      const response = await axios.get<PointsResponse>(`${API_URL}/points`);
      return response.data;
    } catch (error) {
      throw this.handleError(error, 'Failed to fetch points');
    }
  }

  static async getProgressCircle(): Promise<ProgressCircle> {
    try {
      const response = await axios.get<ProgressCircle>(`${API_URL}/progress-circle`);
      return response.data;
    } catch (error) {
      throw this.handleError(error, 'Failed to fetch progress data');
    }
  }

  static async getActivityFeed(limit: number = 20, offset: number = 0): Promise<ActivityFeed> {
    try {
      const response = await axios.get<ActivityFeed>(`${API_URL}/activity`, {
        params: { limit, offset }
      });
      return response.data;
    } catch (error) {
      throw this.handleError(error, 'Failed to fetch activity feed');
    }
  }

  static async getAchievements(): Promise<{ achievements: Achievement[] }> {
    try {
      const response = await axios.get<{ achievements: Achievement[] }>(
        `${API_URL}/achievements`
      );
      return response.data;
    } catch (error) {
      throw this.handleError(error, 'Failed to fetch achievements');
    }
  }

  static async getSettings(): Promise<{ settings: ProfileSettings }> {
    try {
      const response = await axios.get<{ settings: ProfileSettings }>(`${API_URL}/settings`);
      return response.data;
    } catch (error) {
      throw this.handleError(error, 'Failed to fetch settings');
    }
  }

  static async updateSettings(settings: ProfileSettings): Promise<{ settings: ProfileSettings }> {
    try {
      const response = await axios.put<{ settings: ProfileSettings }>(
        `${API_URL}/settings`,
        settings
      );
      return response.data;
    } catch (error) {
      throw this.handleError(error, 'Failed to update settings');
    }
  }

  static async trackActivity(activityType: string, data: any): Promise<void> {
    try {
      await axios.post(`${API_URL}/activity/track`, {
        type: activityType,
        data,
        timestamp: new Date().toISOString()
      });
    } catch (error) {
      throw this.handleError(error, 'Failed to track activity');
    }
  }

  // Add method to handle file validation before upload
  private static validateFile(file: File): boolean {
    const maxSize = 5 * 1024 * 1024; // 5MB
    const allowedTypes = ['image/jpeg', 'image/png', 'image/gif'];

    if (file.size > maxSize) {
      throw new Error('File size exceeds 5MB limit');
    }

    if (!allowedTypes.includes(file.type)) {
      throw new Error('Invalid file type. Only JPEG, PNG and GIF are allowed');
    }

    return true;
  }

  static async deleteAccount(): Promise<{ message: string }> {
    try {
      const response = await axios.delete<{ message: string }>(`${API_URL}/delete`);
      return response.data;
    } catch (error) {
      throw this.handleError(error, 'Failed to delete account');
    }
  }

  private static handleError(error: any, defaultMessage: string): Error {
    if (axios.isAxiosError(error)) {
      const message = error.response?.data?.message || defaultMessage;
      throw new Error(message);
    }
    throw error;
  }
}

export default ProfileService;
