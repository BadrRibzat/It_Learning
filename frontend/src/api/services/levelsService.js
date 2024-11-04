import axiosInstance from '../axios';

export const levelsService = {
  fetchLevels: async () => {
    const response = await axiosInstance.get('levels/');
    return response.data;
  },
  fetchLevel: async (id) => {
    const response = await axiosInstance.get(`levels/${id}/`);
    return response.data;
  },
  fetchUserLevelProgress: async () => {
    const response = await axiosInstance.get('user-level-progress/');
    return response.data;
  },
  updateUserLevelProgress: async (levelId, progress) => {
    const response = await axiosInstance.post(`user-level-progress/${levelId}/`, progress);
    return response.data;
  },
};
