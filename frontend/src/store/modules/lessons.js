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
      const lessons = await lessonService.fetchLessons();
      commit('setLessons', lessons);
    } catch (error) {
      console.error('Fetch lessons failed:', error);
      throw error;
    }
  },
  async fetchLesson({ commit }, id) {
    try {
      const lesson = await lessonService.fetchLesson(id);
      commit('setCurrentLesson', lesson);
    } catch (error) {
      console.error('Fetch lesson failed:', error);
      throw error;
    }
  },
  async fetchCurrentLesson({ commit }) {
    try {
      const lesson = await lessonService.fetchCurrentLesson();
      commit('setCurrentLesson', lesson);
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
