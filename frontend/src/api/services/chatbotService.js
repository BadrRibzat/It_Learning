import axiosInstance from '../axios';

export const chatbotService = {
  sendMessage: async (message) => {
    const response = await axiosInstance.post('chat/', { input: message });
    return response.data;
  },
};
