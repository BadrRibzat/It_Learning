import axiosInstance from './axios';

const levelsService = {
  getLevels: () => axiosInstance.get('/levels/'),
  getLevel: (id) => axiosInstance.get(`/levels/${id}/`),
  getLevelLessons: (levelId) => axiosInstance.get(`/levels/${levelId}/lessons/`),
  getLevelTestQuestions: (levelId) => axiosInstance.get(`/level-test-questions/?level=${levelId}`),
  submitLevelTest: (levelId, answers) => axiosInstance.post(`/level-test-submit/${levelId}/`, { answers }),
};

export default levelsService;
