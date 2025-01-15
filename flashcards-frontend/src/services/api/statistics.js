import axiosInstance from './axios';

const statisticsService = {
  getUserStats: () => axiosInstance.get('/statistics/'),
  getUserProgress: () => axiosInstance.get('/user-progress/'),
  getRecentActivity: () => axiosInstance.get('/recent-activity/'),
};

export default statisticsService;
