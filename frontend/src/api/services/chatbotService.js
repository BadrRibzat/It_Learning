import axiosInstance from '../axios';

export const chatbotService = {
  sendMessage: async (message) => {
    try {
      const response = await axiosInstance.post('chatbot/', { input: message });
      return response.data;
    } catch (error) {
      throw error.response.data;
    }
  },
};
