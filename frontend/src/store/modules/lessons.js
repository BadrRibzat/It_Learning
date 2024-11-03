import lessonsService from '../../api/services/lessons';

const state = {
  lessons: [],
  flashcards: [],
  quizzes: [],
  recommendedLessons: [],
};

const mutations = {
  SET_LESSONS(state, lessons) {
    state.lessons = lessons;
  },
  SET_FLASHCARDS(state, flashcards) {
    state.flashcards = flashcards;
  },
  SET_QUIZZES(state, quizzes) {
    state.quizzes = quizzes;
  },
  SET_RECOMMENDED_LESSONS(state, lessons) {
    state.recommendedLessons = lessons;
  },
};

const actions = {
  async fetchLessons({ commit }) {
    const response = await lessonsService.getLessons();
    commit('SET_LESSONS', response.data);
  },
  async fetchLesson({ commit }, lessonId) {
    const response = await lessonsService.getLesson(lessonId);
    return response.data;
  },
  async fetchFlashcards({ commit }, lessonId) {
    const response = await lessonsService.getFlashcards(lessonId);
    commit('SET_FLASHCARDS', response.data);
  },
  async fetchQuizzes({ commit }, lessonId) {
    const response = await lessonsService.getQuizzes(lessonId);
    commit('SET_QUIZZES', response.data);
  },
  async submitFlashcard({ commit }, { flashcardId, answer }) {
    const response = await lessonsService.submitFlashcard(flashcardId, answer);
    return response.data;
  },
  async submitQuiz({ commit }, { quizId, answers }) {
    const response = await lessonsService.submitQuiz(quizId, answers);
    return response.data;
  },
  async recommendNextLesson({ commit }) {
    const response = await lessonsService.recommendNextLesson();
    commit('SET_RECOMMENDED_LESSONS', response.data);
  },
};

const getters = {
  lessons: (state) => state.lessons,
  flashcards: (state) => state.flashcards,
  quizzes: (state) => state.quizzes,
  recommendedLessons: (state) => state.recommendedLessons,
};

export default {
  namespaced: true,
  state,
  mutations,
  actions,
  getters,
};

