import axiosInstance from '../axios';

export const levelTestsService = {
  fetchLevelTests: async () => {
    const response = await axiosInstance.get('level-tests/');
    return response.data;
  },
  fetchLevelTest: async (id) => {
    const response = await axiosInstance.get(`level-tests/${id}/`);
    return response.data;
  },
  submitLevelTest: async (id, answers) => {
    const response = await axiosInstance.post(`level-test-submit/${id}/`, { answers });
    return response.data;
  },
};
