import axiosInstance from '../axios';

export const levelTestsService = {
  fetchLevelTests: async () => {
    try {
      const response = await axiosInstance.get('level-tests/');
      return response.data;
    } catch (error) {
      throw error.response.data;
    }
  },
  fetchLevelTest: async (id) => {
    try {
      const response = await axiosInstance.get(`level-tests/${id}/`);
      return response.data;
    } catch (error) {
      throw error.response.data;
    }
  },
};
