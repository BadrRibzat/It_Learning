import axiosInstance from './axios';

const chatbotService = {
  chat: (message) => axiosInstance.post('/chat/', { message }),
  getBotResponse: (message) => axiosInstance.post('/chatbot/', { message }),
};

export default chatbotService;
