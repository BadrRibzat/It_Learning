import { ChatbotService } from '@/services/api/ChatbotService';

const state = {
  messages: [],
  isChatOpen: false,
};

const mutations = {
  ADD_MESSAGE(state, message) {
    state.messages.push(message);
  },
  TOGGLE_CHAT(state) {
    state.isChatOpen = !state.isChatOpen;
  },
};

const actions = {
  async sendMessage({ commit }, message) {
    try {
      commit('ADD_MESSAGE', { text: message, isBot: false });

      const response = await ChatbotService.sendMessage(message);

      commit('ADD_MESSAGE', { text: response.response_text, isBot: true });
    } catch (error) {
      console.error('Error sending message:', error);
      commit('ADD_MESSAGE', {
        text: 'Sorry, I encountered an error. Please try again.',
        isBot: true,
      });
    }
  },
  toggleChat({ commit }) {
    commit('TOGGLE_CHAT');
  },
};

const getters = {
  messages: (state) => state.messages,
  isChatOpen: (state) => state.isChatOpen,
};

export default {
  namespaced: true,
  state,
  mutations,
  actions,
  getters,
};
