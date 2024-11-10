import chatbotService from '@/services/api/chatbot';

export default {
  namespaced: true,
  state: () => ({
    messages: [],
    isLoading: false,
  }),
  actions: {
    async sendMessage({ commit }, message) {
      try {
        commit('setLoading', true);
        const response = await chatbotService.chat(message);
        commit('addMessage', { type: 'user', text: message });
        commit('addMessage', { type: 'bot', text: response.data.response_text });
      } catch (error) {
        console.error('Failed to send message', error);
        throw error;
      } finally {
        commit('setLoading', false);
      }
    },
  },
  mutations: {
    setLoading(state, isLoading) {
      state.isLoading = isLoading;
    },
    addMessage(state, message) {
      state.messages.push(message);
    },
    clearMessages(state) {
      state.messages = [];
    },
  }
};
