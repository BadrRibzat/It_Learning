import axiosInstance from './axios';
import { API_ENDPOINTS } from '@/config';

const chatbotService = {
    sendMessage: async (message) => {
        if (!message) {
            throw new Error('Message is required');
        }
        try {
            const response = await axiosInstance.post(API_ENDPOINTS.CHAT.BOT, { 
                input: message,
                message: message 
            });
            return response.data;
        } catch (error) {
            console.error('Error sending message:', error.response?.data || error);
            throw error;
        }
    },
};

export default chatbotService;
