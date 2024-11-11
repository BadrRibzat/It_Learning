import notesService from '@/services/api/notes';

export default {
    namespaced: true,
    state: () => ({
        notes: [],
        currentNote: null,
        isEditing: false,
        editingNote: null,
        loading: false,
        error: null
    }),
    
    mutations: {
        SET_NOTES(state, notes) {
            state.notes = notes;
        },
        ADD_NOTE(state, note) {
            state.notes.unshift(note);
        },
        UPDATE_NOTE(state, updatedNote) {
            const index = state.notes.findIndex(n => n.id === updatedNote.id);
            if (index !== -1) {
                state.notes.splice(index, 1, updatedNote);
            }
        },
        REMOVE_NOTE(state, id) {
            state.notes = state.notes.filter(n => n.id !== id);
        },
        SET_LOADING(state, isLoading) {
            state.loading = isLoading;
        },
        SET_ERROR(state, error) {
            state.error = error;
        },
        SET_EDITING(state, isEditing) {
            state.isEditing = isEditing;
        },
        SET_EDITING_NOTE(state, note) {
            state.editingNote = note ? { ...note } : null;
        }
    },
    
    actions: {
        async fetchNotes({ commit }) {
            commit('SET_LOADING', true);
            commit('SET_ERROR', null);
            
            try {
                const response = await notesService.getNotes();
                commit('SET_NOTES', response.data);
            } catch (error) {
                const errorMessage = error.response?.data?.details || error.message;
                commit('SET_ERROR', errorMessage);
                throw error;
            } finally {
                commit('SET_LOADING', false);
            }
        },
        
        async createNote({ commit, dispatch }, noteData) {
            commit('SET_LOADING', true);
            commit('SET_ERROR', null);
            
            try {
                const response = await notesService.createNote(noteData);
                commit('ADD_NOTE', response.data);
                dispatch('app/showNotification', {
                    message: 'Note created successfully',
                    type: 'success'
                }, { root: true });
                return response.data;
            } catch (error) {
                const errorMessage = error.response?.data?.details || error.message;
                commit('SET_ERROR', errorMessage);
                dispatch('app/showNotification', {
                    message: errorMessage,
                    type: 'error'
                }, { root: true });
                throw error;
            } finally {
                commit('SET_LOADING', false);
            }
        },
        
        async updateNote({ commit, dispatch }, { id, noteData }) {
	    commit('SET_LOADING', true);
            commit('SET_ERROR', null);
        
            try {
                const response = await notesService.updateNote(id, noteData);
                commit('UPDATE_NOTE', response.data);
                commit('SET_EDITING', false);
                dispatch('app/showNotification', {
                    message: 'Note updated successfully',
                    type: 'success'
                }, { root: true });
                return response.data;
            } catch (error) {
                const errorMessage = error.response?.data?.details || error.message;
                commit('SET_ERROR', errorMessage);
                dispatch('app/showNotification', {
                    message: errorMessage,
                    type: 'error'
                }, { root: true });
                throw error;
            } finally {
                commit('SET_LOADING', false);
            }
        },
        
        async deleteNote({ commit, dispatch }, id) {
	    commit('SET_LOADING', true);
	    commit('SET_ERROR', null);
    
	    try {
	        await notesService.deleteNote(id);
	        commit('REMOVE_NOTE', id);
	        dispatch('app/showNotification', {
	            message: 'Note deleted successfully',
	            type: 'success'
	        }, { root: true });
	    } catch (error) {
	        const errorMessage = error.response?.data?.details || error.message;
	        commit('SET_ERROR', errorMessage);
	        dispatch('app/showNotification', {
	            message: errorMessage,
	            type: 'error'
	        }, { root: true });
	        throw error;
	    } finally {
	        commit('SET_LOADING', false);
	    }
	},

	startEditing({ commit }, note) {
	    // Create a deep copy of the note to prevent direct mutation
	    commit('SET_EDITING_NOTE', { ...note });
	    commit('SET_EDITING', true);
	},

	cancelEditing({ commit }) {
	    commit('SET_EDITING_NOTE', null);
	    commit('SET_EDITING', false);
	}
