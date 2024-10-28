import { noteService } from '@/api/services/notes';

export default {
  namespaced: true,
  state: {
    notes: [],
    currentNote: null,
    loading: false,
    error: null,
  },
  mutations: {
    SET_NOTES(state, notes) {
      state.notes = notes;
    },
    SET_CURRENT_NOTE(state, note) {
      state.currentNote = note;
    },
    ADD_NOTE(state, note) {
      state.notes.unshift(note);
    },
    UPDATE_NOTE(state, updatedNote) {
      const index = state.notes.findIndex((note) => note.id === updatedNote.id);
      if (index !== -1) {
        state.notes.splice(index, 1, updatedNote);
      }
    },
    DELETE_NOTE(state, noteId) {
      state.notes = state.notes.filter((note) => note.id !== noteId);
    },
    SET_LOADING(state, loading) {
      state.loading = loading;
    },
    SET_ERROR(state, error) {
      state.error = error;
    },
  },
  actions: {
    async fetchNotes({ commit }) {
      try {
        commit('SET_LOADING', true);
        const { data } = await noteService.getNotes();
        commit('SET_NOTES', data);
      } catch (error) {
        commit('SET_ERROR', error.response?.data?.message || 'Failed to fetch notes');
      } finally {
        commit('SET_LOADING', false);
      }
    },
    async createNote({ commit }, noteData) {
      try {
        commit('SET_LOADING', true);
        const { data } = await noteService.createNote(noteData);
        commit('ADD_NOTE', data);
      } catch (error) {
        commit('SET_ERROR', error.response?.data?.message || 'Failed to create note');
        throw error;
      } finally {
        commit('SET_LOADING', false);
      }
    },
    async updateNote({ commit }, { id, noteData }) {
      try {
        commit('SET_LOADING', true);
        const { data } = await noteService.updateNote(id, noteData);
        commit('UPDATE_NOTE', data);
      } catch (error) {
        commit('SET_ERROR', error.response?.data?.message || 'Failed to update note');
        throw error;
      } finally {
        commit('SET_LOADING', false);
      }
    },
    async deleteNote({ commit }, noteId) {
      try {
        commit('SET_LOADING', true);
        await noteService.deleteNote(noteId);
        commit('DELETE_NOTE', noteId);
      } catch (error) {
        commit('SET_ERROR', error.response?.data?.message || 'Failed to delete note');
        throw error;
      } finally {
        commit('SET_LOADING', false);
      }
    },
  },
  getters: {
    allNotes: (state) => state.notes,
    currentNote: (state) => state.currentNote,
    isLoading: (state) => state.loading,
    error: (state) => state.error,
  },
};
