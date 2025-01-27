import ChatbotService from '@/services/api/ChatbotService';

export default {
  namespaced: true,

  state: {
    messages: [],
    isChatOpen: false,
    loading: false,
    error: null
  },

  mutations: {
    ADD_MESSAGE(state, message) {
      state.messages = [...state.messages, message];
    },
    TOGGLE_CHAT(state) {
      state.isChatOpen = !state.isChatOpen;
    },
    SET_LOADING(state, status) {
      state.loading = status;
    },
    SET_ERROR(state, error) {
      state.error = error;
    },
    CLEAR_MESSAGES(state) {
      state.messages = [];
    }
  },

  actions: {
    async sendMessage({ commit }, message) {
      if (!message.trim()) return;
      
      commit('SET_LOADING', true);
      
      // Add user message
      commit('ADD_MESSAGE', {
        text: message,
        isUser: true,
        timestamp: new Date()
      });

      try {
        const response = await ChatbotService.sendMessage(message);
        
        // Add bot response
        commit('ADD_MESSAGE', {
          text: response.response_text,
          isBot: true,
          timestamp: new Date()
        });
      } catch (error) {
        commit('SET_ERROR', error.message);
        commit('ADD_MESSAGE', {
          text: 'Sorry, I encountered an error. Please try again.',
          isBot: true,
          isError: true,
          timestamp: new Date()
        });
      } finally {
        commit('SET_LOADING', false);
      }
    },

    toggleChat({ commit }) {
      commit('TOGGLE_CHAT');
    },

    clearChat({ commit }) {
      commit('CLEAR_MESSAGES');
    }
  },

  getters: {
    messages: state => state.messages || [],
    isChatOpen: state => state.isChatOpen,
    isLoading: state => state.loading,
    error: state => state.error
  }
};
