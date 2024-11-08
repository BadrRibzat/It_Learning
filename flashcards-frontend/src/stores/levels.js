import createBaseStore from './base';
import levelsService from '@/services/api/levels';

const initialState = {
  levels: [],
  currentLevel: null,
  levelLessons: [],
  levelTestQuestions: [],
  testProgress: {
    currentQuestion: 0,
    answers: {},
    completed: false,
  },
};

const { state, setState } = createBaseStore(initialState);

const actions = {
  async fetchLevels({ commit }) {
    try {
      const response = await levelsService.getLevels();
      commit('setLevels', response.data);
    } catch (error) {
      console.error('Failed to fetch levels', error);
      throw error;
    }
  },
  async fetchLevel({ commit }, levelId) {
    try {
      const response = await levelsService.getLevel(levelId);
      commit('setCurrentLevel', response.data);
    } catch (error) {
      console.error('Failed to fetch level', error);
      throw error;
    }
  },
  async fetchLevelLessons({ commit }, levelId) {
    try {
      const response = await levelsService.getLevelLessons(levelId);
      commit('setLevelLessons', response.data);
    } catch (error) {
      console.error('Failed to fetch level lessons', error);
      throw error;
    }
  },
  async fetchLevelTestQuestions({ commit }, levelId) {
    try {
      const response = await levelsService.getLevelTestQuestions(levelId);
      commit('setLevelTestQuestions', response.data);
    } catch (error) {
      console.error('Failed to fetch level test questions', error);
      throw error;
    }
  },
  async submitLevelTest({ commit, state }, { levelId, answers }) {
    try {
      const response = await levelsService.submitLevelTest(levelId, answers);
      commit('setTestCompleted', true);
      return response.data;
    } catch (error) {
      console.error('Failed to submit level test', error);
      throw error;
    }
  },
  setTestAnswer({ commit }, { questionId, answer }) {
    commit('updateTestAnswer', { questionId, answer });
  },
  nextQuestion({ commit, state }) {
    if (state.testProgress.currentQuestion < state.levelTestQuestions.length - 1) {
      commit('setCurrentQuestion', state.testProgress.currentQuestion + 1);
    }
  },
  previousQuestion({ commit, state }) {
    if (state.testProgress.currentQuestion > 0) {
      commit('setCurrentQuestion', state.testProgress.currentQuestion - 1);
    }
  },
  resetTest({ commit }) {
    commit('resetTestProgress');
  },
};

const mutations = {
  setLevels(state, levels) {
    state.levels = levels;
  },
  setCurrentLevel(state, level) {
    state.currentLevel = level;
  },
  setLevelLessons(state, lessons) {
    state.levelLessons = lessons;
  },
  setLevelTestQuestions(state, questions) {
    state.levelTestQuestions = questions;
  },
  updateTestAnswer(state, { questionId, answer }) {
    state.testProgress.answers = {
      ...state.testProgress.answers,
      [questionId]: answer
    };
  },
  setCurrentQuestion(state, questionIndex) {
    state.testProgress.currentQuestion = questionIndex;
  },
  setTestCompleted(state, completed) {
    state.testProgress.completed = completed;
  },
  resetTestProgress(state) {
    state.testProgress = {
      currentQuestion: 0,
      answers: {},
      completed: false,
    };
  },
};

export default {
  namespaced: true,
  state,
  actions,
  mutations,
};
