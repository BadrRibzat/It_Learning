import { quizzesService } from '../../api/services/quizzesService';

const state = {
  quizzes: [],
  currentQuiz: null,
};

const getters = {
  quizzes: (state) => state.quizzes,
  currentQuiz: (state) => state.currentQuiz,
};

const actions = {
  async fetchQuizzes({ commit }) {
    try {
      const response = await quizzesService.fetchQuizzes();
      commit('setQuizzes', response);
    } catch (error) {
      console.error('Fetch quizzes failed:', error);
      throw error;
    }
  },
  async fetchQuiz({ commit }, id) {
    try {
      const response = await quizzesService.fetchQuiz(id);
      commit('setCurrentQuiz', response);
    } catch (error) {
      console.error('Fetch quiz failed:', error);
      throw error;
    }
  },
};

const mutations = {
  setQuizzes(state, quizzes) {
    state.quizzes = quizzes;
  },
  setCurrentQuiz(state, quiz) {
    state.currentQuiz = quiz;
  },
};

export default {
  state,
  getters,
  actions,
  mutations,
};
