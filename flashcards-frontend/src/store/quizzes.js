import quizzesService from '@/services/api/quizzes';

export default {
  namespaced: true,
  state: () => ({
    quizzes: [],
    currentQuiz: null,
  }),
  actions: {
    async fetchQuizzes({ commit }, lessonId) {
      try {
        const response = await quizzesService.getQuizzes(lessonId);
        commit('setQuizzes', response.data);
      } catch (error) {
        console.error('Failed to fetch quizzes', error);
        throw error;
      }
    },
    async fetchQuiz({ commit }, id) {
      try {
        const response = await quizzesService.getQuiz(id);
        commit('setCurrentQuiz', response.data);
      } catch (error) {
        console.error('Failed to fetch quiz', error);
        throw error;
      }
    },
    async submitQuiz({ commit }, { id, answers }) {
      try {
        const response = await quizzesService.submitQuiz(id, answers);
        return response.data;
      } catch (error) {
        console.error('Failed to submit quiz', error);
        throw error;
      }
    },
  },
  mutations: {
    setQuizzes(state, quizzes) {
      state.quizzes = quizzes;
    },
    setCurrentQuiz(state, quiz) {
      state.currentQuiz = quiz;
    },
  }
};
