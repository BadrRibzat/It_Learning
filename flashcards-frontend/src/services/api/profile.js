import axiosInstance from './axios';

const profileService = {
  getProfile: () => axiosInstance.get('/profile/'),
  updateProfile: (profileData) => axiosInstance.put('/profile/', profileData),
  uploadProfilePicture: (formData) => axiosInstance.post('/upload-profile-picture/', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  }),
  resetProgress: () => axiosInstance.post('/reset-progress/'),
};

export default profileService;
