import axiosInstance from '../../api/axios';

const state = {
  quizzes: [],
};

const getters = {
  quizzes: (state) => state.quizzes,
};

const actions = {
  async fetchQuizzes({ commit }) {
    const response = await axiosInstance.get('quizzes/');
    commit('setQuizzes', response.data);
  },
};

const mutations = {
  setQuizzes(state, quizzes) {
    state.quizzes = quizzes;
  },
};

export default {
  state,
  getters,
  actions,
  mutations,
};
