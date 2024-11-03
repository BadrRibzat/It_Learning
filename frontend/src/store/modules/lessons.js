import axiosInstance from '../../api/axios';

const state = {
  lessons: [],
  currentLesson: null,
};

const getters = {
  lessons: (state) => state.lessons,
  currentLesson: (state) => state.currentLesson,
};

const actions = {
  async fetchLessons({ commit }) {
    const response = await axiosInstance.get('lessons/');
    commit('setLessons', response.data);
  },
  async fetchCurrentLesson({ commit }) {
    const response = await axiosInstance.get('current-lesson/');
    commit('setCurrentLesson', response.data);
  },
};

const mutations = {
  setLessons(state, lessons) {
    state.lessons = lessons;
  },
  setCurrentLesson(state, lesson) {
    state.currentLesson = lesson;
  },
};

export default {
  state,
  getters,
  actions,
  mutations,
};
