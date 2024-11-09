import axiosInstance from './axios';
import { API_ENDPOINTS } from '@/config';

const lessonsService = {
  getLessons: (levelId) => axiosInstance.get(`${API_ENDPOINTS.LESSONS.LIST}?level=${levelId}`),
  getLesson: (id) => axiosInstance.get(API_ENDPOINTS.LESSONS.DETAIL(id)),
  recommendNextLesson: () => axiosInstance.get(API_ENDPOINTS.LESSONS.RECOMMEND),
  updateCurrentLesson: (lessonId) => axiosInstance.post(API_ENDPOINTS.LESSONS.UPDATE_CURRENT, { lesson_id: lessonId }),
};

export default lessonsService;
