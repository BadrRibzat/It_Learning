import { chatbotService } from '../../api/services/chatbotService';

const state = {
  chatHistory: [],
};

const getters = {
  chatHistory: (state) => state.chatHistory,
};

const actions = {
  async sendMessage({ commit }, message) {
    try {
      const response = await chatbotService.sendMessage(message);
      commit('addMessage', { sender: 'user', content: message });
      commit('addMessage', { sender: 'bot', content: response.response_text });
      return response;
    } catch (error) {
      console.error('Chatbot message failed:', error);
      throw error;
    }
  },
};

const mutations = {
  addMessage(state, message) {
    state.chatHistory.push(message);
  },
  clearChatHistory(state) {
    state.chatHistory = [];
  },
};

export default {
  state,
  getters,
  actions,
  mutations,
};
