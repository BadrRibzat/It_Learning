import apiClient from './apiClient';

export default {
  async sendMessage(message) {
    try {
      const response = await apiClient.post('/chatbot/chatbot', {
        input: message
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: error.message };
    }
  }
};
