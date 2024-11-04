import { lessonService } from '../../api/services/lessonService';

const state = {
  lessons: [],
  currentLesson: null,
  userProgress: [],
};

const getters = {
  lessons: (state) => state.lessons,
  currentLesson: (state) => state.currentLesson,
  userProgress: (state) => state.userProgress,
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
  async fetchUserProgress({ commit }) {
    try {
      const progress = await lessonService.fetchUserProgress();
      commit('setUserProgress', progress);
    } catch (error) {
      console.error('Fetch user progress failed:', error);
      throw error;
    }
  },
  async updateLessonProgress({ commit }, { lessonId, completed }) {
    try {
      const updatedProgress = await lessonService.updateLessonProgress(lessonId, completed);
      commit('updateUserProgress', updatedProgress);
    } catch (error) {
      console.error('Update lesson progress failed:', error);
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
  setUserProgress(state, progress) {
    state.userProgress = progress;
  },
  updateUserProgress(state, updatedProgress) {
    const index = state.userProgress.findIndex(p => p.lesson === updatedProgress.lesson);
    if (index !== -1) {
      state.userProgress.splice(index, 1, updatedProgress);
    } else {
      state.userProgress.push(updatedProgress);
    }
  },
};

export default {
  state,
  getters,
  actions,
  mutations,
};
