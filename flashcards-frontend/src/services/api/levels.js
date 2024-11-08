import axiosInstance from './axios';

const levelsService = {
  getLevels: () => axiosInstance.get('/levels/'),
  getLevel: (id) => axiosInstance.get(`/levels/${id}/`),
  getLevelTestQuestions: (id) => axiosInstance.get(`/levels/${id}/test-questions/`),
  submitLevelTest: (id, score) => axiosInstance.post(`/level-test-submit/${id}/`, { score }),
};

export default levelsService;
