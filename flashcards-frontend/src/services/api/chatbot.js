import axiosInstance from './axios';
import { API_ENDPOINTS } from '@/config';

const chatbotService = {
  chat: (message) => axiosInstance.post(API_ENDPOINTS.CHAT.SEND, { message }),
  getBotResponse: (message) => axiosInstance.post(API_ENDPOINTS.CHAT.BOT, { message }),
};

export default chatbotService;
