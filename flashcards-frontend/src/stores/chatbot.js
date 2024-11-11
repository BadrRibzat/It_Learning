import chatbotService from '@/services/api/chatbot';

export default {
  namespaced: true,
  state: () => ({
    messages: [],
    isLoading: false,
    error: null,
  }),
  actions: {
    async sendMessage({ commit }, message) {
      commit('setLoading', true);
      commit('clearError');
      
      try {
        // Add user message
        commit('addMessage', { type: 'user', text: message });
        
        // Get bot response
        const response = await chatbotService.sendMessage(message);
        
        // Add bot response
        const botResponse = response.data?.response || response.response_text || 'Sorry, I could not understand that.';
        commit('addMessage', { type: 'bot', text: botResponse });
        
        return botResponse;
      } catch (error) {
        commit('setError', error.message || 'Failed to send message');
        commit('addMessage', { 
          type: 'bot', 
          text: 'Sorry, I am experiencing some difficulties right now.' 
        });
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
    setError(state, error) {
      state.error = error;
    },
    clearError(state) {
      state.error = null;
    }
  },
  getters: {
    getMessages: (state) => state.messages,
    isLoading: (state) => state.isLoading,
    getError: (state) => state.error,
  }
};
