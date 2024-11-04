import { lessonService } from '../../api/services/lessonService';

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
    try {
      const response = await lessonService.fetchLessons();
      commit('setLessons', response);
    } catch (error) {
      console.error('Fetch lessons failed:', error);
      throw error;
    }
  },
  async fetchCurrentLesson({ commit }) {
    try {
      const response = await lessonService.fetchCurrentLesson();
      commit('setCurrentLesson', response);
    } catch (error) {
      console.error('Fetch current lesson failed:', error);
      throw error;
    }
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
