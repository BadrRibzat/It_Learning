import axiosInstance from './axios';
import { API_ENDPOINTS } from '@/config';

const statisticsService = {
  getUserStats: () => axiosInstance.get(API_ENDPOINTS.STATISTICS.USER),
  getUserProgress: () => axiosInstance.get(API_ENDPOINTS.STATISTICS.PROGRESS),
  getRecentActivity: () => axiosInstance.get('/recent-activity/'),
};

export default statisticsService;
