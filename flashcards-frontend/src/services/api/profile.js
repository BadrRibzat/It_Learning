import axiosInstance from './axios';
import { API_ENDPOINTS } from '@/config';

const profileService = {
  getProfile: () => axiosInstance.get(API_ENDPOINTS.PROFILE.DETAIL),
  updateProfile: (profileData) => axiosInstance.put(API_ENDPOINTS.PROFILE.DETAIL, profileData),
  uploadProfilePicture: (formData) => axiosInstance.post(API_ENDPOINTS.PROFILE.UPLOAD_PICTURE, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  }),
  deleteProfilePicture: () => axiosInstance.post(API_ENDPOINTS.PROFILE.DELETE_PICTURE),
  resetProgress: () => axiosInstance.post(API_ENDPOINTS.PROFILE.RESET_PROGRESS),
};

export default profileService;
