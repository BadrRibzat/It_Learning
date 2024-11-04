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
};
