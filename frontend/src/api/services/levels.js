import axios from '../axios';

export const levelService = {
  getLevels: () => axios.get('/api/levels/'),
  getLevel: (levelId) => axios.get(`/api/levels/${levelId}/`),
  getLevelLessons: (levelId) => axios.get(`/api/levels/${levelId}/lessons/`),
};
