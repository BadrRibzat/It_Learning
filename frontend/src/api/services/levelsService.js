import axiosInstance from '../axios';

export const levelsService = {
  fetchLevels: async () => {
    try {
      const response = await axiosInstance.get('levels/');
      return response.data;
    } catch (error) {
      throw error.response.data;
    }
  },
  fetchLevel: async (id) => {
    try {
      const response = await axiosInstance.get(`levels/${id}/`);
      return response.data;
    } catch (error) {
      throw error.response.data;
    }
  },
};
