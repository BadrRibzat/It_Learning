import axios from '../axios';

export const progressService = {
  getUserProgress: () => axios.get('/api/user-progress/'),
  updateUserProgress: (progressData) => axios.post('/api/user-progress/', progressData),
  getLevelProgress: (levelId) => axios.get(`/api/level-progress/${levelId}/`),
  updateLevelProgress: (levelId, progressData) => axios.put(`/api/level-progress/${levelId}/`, progressData),
};
