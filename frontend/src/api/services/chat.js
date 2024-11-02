import axios from '../axios';

export const chatService = {
  sendMessage: (message) => axios.post('/api/chat/', { input: message }),
  getChatHistory: () => axios.get('/api/chat/history/'),
};
