import axiosInstance from './axios';
import { API_ENDPOINTS } from '@/config';

const chatbotService = {
    chat: async (message) => {
        if (!message) {
            throw new Error('Message is required');
        }
        try {
            const response = await axiosInstance.post(API_ENDPOINTS.CHAT.SEND, { message });
            return response.data;
        } catch (error) {
            console.error('Error sending message:', error.response.data);
            throw error;
        }
    },
    getBotResponse: async (message) => {
        if (!message) {
            throw new Error('Message is required');
        }
        try {
            const response = await axiosInstance.post(API_ENDPOINTS.CHAT.BOT, { message });
            return response.data;
        } catch (error) {
            console.error('Error getting bot response:', error.response.data);
            throw error;
        }
    },
};

export default chatbotService;
