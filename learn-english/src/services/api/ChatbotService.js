import axios from 'axios';

const API_BASE_URL = 'http://127.0.0.1:8000/chatbot';

export const ChatbotService = {
  async sendMessage(message) {
    try {
      const response = await axios.post(`${API_BASE_URL}/chatbot/`, {
        input: message,
      });
      return response.data;
    } catch (error) {
      console.error('Error sending message to chatbot:', error);
      throw error;
    }
  },
};
