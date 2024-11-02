import { chatService } from '@/api/services/chat';

export default {
  namespaced: true,
  state: {
    messages: [],
    loading: false,
    error: null,
  },
  mutations: {
    ADD_MESSAGE(state, message) {
      state.messages.push(message);
    },
    SET_MESSAGES(state, messages) {
      state.messages = messages;
    },
    SET_LOADING(state, loading) {
      state.loading = loading;
    },
    SET_ERROR(state, error) {
      state.error = error;
    },
  },
  actions: {
    async sendMessage({ commit }, message) {
      try {
        commit('SET_LOADING', true);
        const { data } = await chatService.sendMessage(message);
        // Ensure the response is correctly formatted
        const response = {
          content: data.response_text,
          timestamp: new Date().toISOString(),
          type: 'bot',
        };
        commit('ADD_MESSAGE', response);
      } catch (error) {
        commit('SET_ERROR', error.response?.data?.message || 'Failed to send message');
      } finally {
        commit('SET_LOADING', false);
      }
    },
    async fetchChatHistory({ commit }) {
      try {
        commit('SET_LOADING', true);
        const { data } = await chatService.getChatHistory();
        commit('SET_MESSAGES', data);
      } catch (error) {
        commit('SET_ERROR', error.response?.data?.message || 'Failed to fetch chat history');
      } finally {
        commit('SET_LOADING', false);
      }
    },
  },
  getters: {
    allMessages: (state) => state.messages,
    isLoading: (state) => state.loading,
    error: (state) => state.error,
  },
};
