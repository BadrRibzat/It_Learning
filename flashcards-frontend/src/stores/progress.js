import progressService from '@/services/api/progress';

export default {
    namespaced: true,
    state: () => ({
        userProgress: null,
        userFlashcardProgress: [],
        userLevelProgress: [],
        userQuizAttempts: [],
    }),
    actions: {
        async fetchUserProgress({ commit }) {
            try {
                const response = await progressService.getUserProgress();
                commit('setUserProgress', response.data);
            } catch (error) {
                console.error('Failed to fetch user progress', error);
                throw error;
            }
        },
        async fetchUserFlashcardProgress({ commit }) {
            try {
                const response = await progressService.getUserFlashcardProgress();
                commit('setUserFlashcardProgress', response.data);
            } catch (error) {
                console.error('Failed to fetch user flashcard progress', error);
                throw error;
            }
        },
        async fetchUserLevelProgress({ commit }) {
            try {
                const response = await progressService.getUserLevelProgress();
                commit('setUserLevelProgress', response.data);
            } catch (error) {
                console.error('Failed to fetch user level progress', error);
                throw error;
            }
        },
        async fetchUserQuizAttempts({ commit }) {
            try {
                const response = await progressService.getUserQuizAttempts();
                commit('setUserQuizAttempts', response.data);
            } catch (error) {
                console.error('Failed to fetch user quiz attempts', error);
                throw error;
            }
        },
        async updateFlashcardProgress({ commit }, { flashcardId, completed }) {
            try {
                const response = await progressService.updateFlashcardProgress(flashcardId, completed);
                commit('updateFlashcardProgress', response.data);
            } catch (error) {
                console.error('Failed to update flashcard progress', error);
                throw error;
            }
        },
    },
    mutations: {
        setUserProgress(state, progress) {
            state.userProgress = progress;
        },
        setUserFlashcardProgress(state, progress) {
            state.userFlashcardProgress = progress;
        },
        setUserLevelProgress(state, progress) {
            state.userLevelProgress = progress;
        },
        setUserQuizAttempts(state, attempts) {
            state.userQuizAttempts = attempts;
        },
        updateFlashcardProgress(state, updatedProgress) {
            const index = state.userFlashcardProgress.findIndex(p => p.id === updatedProgress.id);
            if (index !== -1) {
                state.userFlashcardProgress.splice(index, 1, updatedProgress);
            }
        },
    }
};
