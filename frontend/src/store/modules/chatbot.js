import { chatbotService } from '../../api/services/chatbotService';

const state = {
  chatbotResponse: null,
};

const getters = {
  chatbotResponse: (state) => state.chatbotResponse,
};

const actions = {
  async sendMessage({ commit }, message) {
    try {
      const response = await chatbotService.sendMessage(message);
      commit('setChatbotResponse', response);
    } catch (error) {
      console.error('Chatbot message failed:', error);
      throw error;
    }
  },
};

const mutations = {
  setChatbotResponse(state, response) {
    state.chatbotResponse = response;
  },
};

export default {
  state,
  getters,
  actions,
  mutations,
};
