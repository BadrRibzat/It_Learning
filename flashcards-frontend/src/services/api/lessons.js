import axiosInstance from './axios';
import { API_ENDPOINTS } from '@/config';

const lessonsService = {
  getLessons(levelId = null) {
    const url = levelId 
      ? `/levels/${levelId}/lessons/`
      : API_ENDPOINTS.LESSONS.LIST;
    return axiosInstance.get(url);
  },
  
  getLesson(id) {
    return axiosInstance.get(API_ENDPOINTS.LESSONS.DETAIL(id));
  },
  
  recommendNextLesson() {
    return axiosInstance.get(API_ENDPOINTS.LESSONS.RECOMMEND);
  },

export default lessonsService;
