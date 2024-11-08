import axiosInstance from './axios';

const levelsService = {
  getLevels: () => axiosInstance.get('/levels/'),
  getLevel: (id) => axiosInstance.get(`/levels/${id}/`),
  getLevelTestQuestions: (id) => axiosInstance.get(`/level-test-questions/${id}/`),
  submitLevelTest: (id, score) => axiosInstance.post(`/level-test-submit/${id}/`, { score }),
  getLevelLessons: (levelId) => axiosInstance.get(`/levels/${levelId}/lessons/`),
};

export default levelsService;
