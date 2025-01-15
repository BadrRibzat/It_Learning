import { register, login, forgotPassword, resetPassword, verifyEmail, logout, setupMFA, verifyMFA } from '../../services/auth.services';

const state = {
    user: null,
    token: null,
    refreshToken: null,
    isAuthenticated: false,
    isEmailVerified: false,
};

const getters = {
    isAuthenticated: (state) => state.isAuthenticated,
    user: (state) => state.user,
    token: (state) => state.token,
    refreshToken: (state) => state.refreshToken,
    isEmailVerified: (state) => state.isEmailVerified,
};

const mutations = {
    SET_USER(state, user) {
        state.user = user;
    },
    SET_TOKEN(state, token) {
        state.token = token;
    },
    SET_REFRESH_TOKEN(state, refreshToken) {
        state.refreshToken = refreshToken;
    },
    SET_AUTHENTICATED(state, isAuthenticated) {
        state.isAuthenticated = isAuthenticated;
    },
    SET_EMAIL_VERIFIED(state, isVerified) {
        state.isEmailVerified = isVerified;
    },
};

const actions = {
    async register({ commit }, userData) {
        try {
            const response = await register(userData);
            commit('SET_USER', response.user);
            commit('SET_TOKEN', response.token);
            commit('SET_REFRESH_TOKEN', response.refresh_token);
            commit('SET_AUTHENTICATED', true);
            return response;
        } catch (error) {
            throw error;
        }
    },

    async login({ commit }, credentials) {
        try {
            const response = await login(credentials);
            commit('SET_USER', response.user);
            commit('SET_TOKEN', response.token);
            commit('SET_REFRESH_TOKEN', response.refresh_token);
            commit('SET_AUTHENTICATED', true);
            return response;
        } catch (error) {
            throw error;
        }
    },

    async forgotPassword({ commit }, email) {
        try {
            const response = await forgotPassword(email);
            return response;
        } catch (error) {
            throw error;
        }
    },

    async resetPassword({ commit }, { token, newPassword }) {
        try {
            const response = await resetPassword(token, newPassword);
            return response;
        } catch (error) {
            throw error;
        }
    },

    async verifyEmail({ commit }, token) {
        try {
            const response = await verifyEmail(token);
            if (response.is_verified) {
                commit('SET_EMAIL_VERIFIED', true);
            }
            return response;
        } catch (error) {
            throw error;
        }
    },

    async logout({ commit, state }) {
        try {
            const response = await logout(state.refreshToken);
            commit('SET_USER', null);
            commit('SET_TOKEN', null);
            commit('SET_REFRESH_TOKEN', null);
            commit('SET_AUTHENTICATED', false);
            return response;
        } catch (error) {
            throw error;
        }
    },

    async setupMFA({ commit }) {
        try {
            const response = await setupMFA();
            return response;
        } catch (error) {
            throw error;
        }
    },

    async verifyMFA({ commit }, token) {
        try {
            const response = await verifyMFA(token);
            return response;
        } catch (error) {
            throw error;
        }
    },
};

export default {
    namespaced: true,
    state,
    getters,
    mutations,
    actions,
};
