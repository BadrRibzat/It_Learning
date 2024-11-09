import axiosInstance from './axios';
import { API_ENDPOINTS } from '@/config';

const levelsService = {
  getLevels: () => axiosInstance.get(API_ENDPOINTS.LEVELS.LIST),
  getLevel: (id) => axiosInstance.get(API_ENDPOINTS.LEVELS.DETAIL(id)),
  getLevelLessons: (levelId) => axiosInstance.get(API_ENDPOINTS.LEVELS.LESSONS(levelId)),
  getLevelTestQuestions: (levelId) => axiosInstance.get(API_ENDPOINTS.LEVELS.TEST_QUESTIONS(levelId)),
  submitLevelTest: (levelId, answers) => axiosInstance.post(API_ENDPOINTS.LEVELS.SUBMIT_TEST(levelId), { answers }),
};

export default levelsService;
