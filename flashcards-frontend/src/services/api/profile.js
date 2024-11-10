import axiosInstance from './axios';
import { API_ENDPOINTS } from '@/config';

const profileService = {
    getProfile: () => axiosInstance.get(API_ENDPOINTS.PROFILE.DETAIL),

    updateProfile: (profileData) => axiosInstance.put(API_ENDPOINTS.PROFILE.DETAIL, {
        username: profileData.username,
        email: profileData.email,
        bio: profileData.bio
    }),

    uploadProfilePicture: (formData) => {
        return axiosInstance.post(API_ENDPOINTS.PROFILE.UPLOAD_PICTURE, formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
    },

    deleteProfilePicture: () => axiosInstance.delete(API_ENDPOINTS.PROFILE.DELETE_PICTURE),

    resetProgress: () => axiosInstance.post(API_ENDPOINTS.PROFILE.RESET_PROGRESS),

    getStats: () => axiosInstance.get('/statistics/'),

    getRecentActivity: () => axiosInstance.get('/user-progress/'),
};

export default profileService;
