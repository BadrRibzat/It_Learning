import axiosInstance from './axios';
import { API_ENDPOINTS } from '@/config';

const lessonsService = {
  getLessons: async (levelId = null) => {
    const url = levelId 
      ? `${API_ENDPOINTS.LESSONS.LIST}?level=${levelId}`
      : API_ENDPOINTS.LESSONS.LIST;
    return axiosInstance.get(url);
  },
  
  getLesson: async (id) => {
    return axiosInstance.get(API_ENDPOINTS.LESSONS.DETAIL(id));
  },
  
  recommendNextLesson: async () => {
    return axiosInstance.get(API_ENDPOINTS.LESSONS.RECOMMEND);
  },
  
  updateCurrentLesson: async (lessonId) => {
    return axiosInstance.post(API_ENDPOINTS.LESSONS.UPDATE_CURRENT, { 
      lesson_id: lessonId 
    });
  }
};

export default lessonsService;
