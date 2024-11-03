import axios from 'axios';

const state = {
  user: null,
  token: localStorage.getItem('token') || null,
};

const getters = {
  isAuthenticated: (state) => !!state.token,
  user: (state) => state.user,
};

const actions = {
  async register({ commit }, userData) {
    const response = await axios.post('/api/register/', userData);
    commit('setToken', response.data.token);
    commit('setUser', response.data.user);
  },
  async login({ commit }, credentials) {
    const response = await axios.post('/api/login/', credentials);
    commit('setToken', response.data.token);
    commit('setUser', response.data.user);
  },
  async logout({ commit }) {
    commit('setToken', null);
    commit('setUser', null);
    localStorage.removeItem('token');
  },
  async fetchUser({ commit }) {
    const response = await axios.get('/api/profile/', {
      headers: { Authorization: `Bearer ${state.token}` },
    });
    commit('setUser', response.data);
  },
};

const mutations = {
  setToken(state, token) {
    state.token = token;
    localStorage.setItem('token', token);
  },
  setUser(state, user) {
    state.user = user;
  },
};

export default {
  state,
  getters,
  actions,
  mutations,
};
