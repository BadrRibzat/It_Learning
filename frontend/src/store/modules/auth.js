import router from '@/router';

export default {
namespaced: true,
state: {
token: localStorage.getItem('token') || null,
user: JSON.parse(localStorage.getItem('user')) || null,
loading: false,
error: null,
},
mutations: {
SET_TOKEN(state, token) {
state.token = token;
if (token) {
localStorage.setItem('token', token);
} else {
localStorage.removeItem('token');
}
},
SET_USER(state, user) {
state.user = user;
if (user) {
localStorage.setItem('user', JSON.stringify(user));
} else {
localStorage.removeItem('user');
}
},
SET_LOADING(state, loading) {
state.loading = loading;
},
SET_ERROR(state, error) {
state.error = error;
},
},
actions: {
async login({ commit }, credentials) {
try {
commit('SET_LOADING', true);
const { data } = await authService.login(credentials);
commit('SET_TOKEN', data.access);
commit('SET_USER', data.user);
router.push('/dashboard');
return true;
} catch (error) {
commit('SET_ERROR', error.response?.data?.detail || 'Login failed');
return false;
} finally {
commit('SET_LOADING', false);
}
},
async register({ commit }, userData) {
try {
commit('SET_LOADING', true);
commit('SET_ERROR', null);
const response = await authService.register(userData);
commit('SET_USER', response.data.user);
commit('SET_TOKEN', response.data.access);
return true;
} catch (error) {
commit('SET_ERROR', error.response?.data?.detail || 'Registration failed');
return false;
} finally {
commit('SET_LOADING', false);
}
},
async logout({ commit, state }) {
try {
if (state.token) {
await authService.logout(state.token);
}
} catch (error) {
console.error('Logout failed:', error);
} finally {
commit('SET_TOKEN', null);
commit('SET_USER', null);
router.push('/auth/login');
}
},
async refreshToken({ commit }) {
try {
const { data } = await authService.refreshToken();
commit('SET_TOKEN', data.access);
return data.access;
} catch (error) {
commit('SET_TOKEN', null);
commit('SET_USER', null);
throw error;
}
},
async fetchUserProfile({ commit }) {
try {
const { data } = await authService.getProfile();
commit('SET_USER', data);
} catch (error) {
console.error('Failed to fetch user profile:', error);
}
},
},
getters: {
isAuthenticated: (state) => !!state.token,
currentUser: (state) => state.user,
isLoading: (state) => state.loading,
error: (state) => state.error,
},
};
