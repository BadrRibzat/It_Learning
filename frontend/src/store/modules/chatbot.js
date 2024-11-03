import axios from 'axios';

const state = {
  chatbotResponse: null,
};

const getters = {
  chatbotResponse: (state) => state.chatbotResponse,
};

const actions = {
  async sendMessage({ commit }, message) {
    const response = await axios.post('/api/chatbot/', { input: message });
    commit('setChatbotResponse', response.data);
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
