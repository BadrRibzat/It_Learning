import { quizzesService } from '../../api/services/quizzesService';

const state = {
  quizzes: [],
  currentQuiz: null,
  userQuizProgress: [],
};

const getters = {
  quizzes: (state) => state.quizzes,
  currentQuiz: (state) => state.currentQuiz,
  userQuizProgress: (state) => state.userQuizProgress,
};

const actions = {
  async fetchQuizzes({ commit }) {
    try {
      const quizzes = await quizzesService.fetchQuizzes();
      commit('setQuizzes', quizzes);
    } catch (error) {
      console.error('Fetch quizzes failed:', error);
      throw error;
    }
  },
  async fetchQuiz({ commit }, id) {
    try {
      const quiz = await quizzesService.fetchQuiz(id);
      commit('setCurrentQuiz', quiz);
    } catch (error) {
      console.error('Fetch quiz failed:', error);
      throw error;
    }
  },
  async submitQuiz({ commit }, { id, answers }) {
    try {
      const result = await quizzesService.submitQuiz(id, answers);
      commit('updateUserQuizProgress', result);
      return result;
    } catch (error) {
      console.error('Submit quiz failed:', error);
      throw error;
    }
  },
  async fetchUserQuizProgress({ commit }) {
    try {
      const progress = await quizzesService.fetchUserQuizProgress();
      commit('setUserQuizProgress', progress);
    } catch (error) {
      console.error('Fetch user quiz progress failed:', error);
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
  setUserQuizProgress(state, progress) {
    state.userQuizProgress = progress;
  },
  updateUserQuizProgress(state, result) {
    const index = state.userQuizProgress.findIndex(p => p.quiz === result.quiz);
    if (index !== -1) {
      state.userQuizProgress.splice(index, 1, result);
    } else {
      state.userQuizProgress.push(result);
    }
  },
};

export default {
  state,
  getters,
  actions,
  mutations,
};
