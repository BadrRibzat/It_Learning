import axios from '../axios';

export const profileService = {
  getProfile: () => axios.get('/api/profile/'),
  updateProfile: (profileData) => axios.put('/api/profile/', profileData),
  uploadProfilePicture: (formData) =>
    axios.post('/api/upload-profile-picture/', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    }),
  getStatistics: () => axios.get('/api/statistics/'),
  getRecommendedLessons: () => axios.get('/api/recommended-lessons/'),
  updateCurrentLesson: (lessonId) =>
    axios.post('/api/update-current-lesson/', { lesson_id: lessonId }),
  resetProgress: () => axios.post('/api/reset-progress/'),
  getUserProgress: () => axios.get('/api/user-progress/'),
  getRecentActivity: () => axios.get('/api/recent-activity/'),
};
