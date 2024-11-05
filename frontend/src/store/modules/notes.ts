import api from '@/api';

const state = {
  notes: [],
};

const mutations = {
  SET_NOTES(state, notes) {
    state.notes = notes;
  },
};

const actions = {
  async fetchNotes({ commit }) {
    try {
      const response = await api.get('/notes/');
      commit('SET_NOTES', response.data);
      return response;
    } catch (error) {
      console.error('Error fetching notes:', error);
      throw error;
    }
  },
  async addNote({ dispatch }, note) {
    try {
      await api.post('/notes/', note);
      await dispatch('fetchNotes');
    } catch (error) {
      console.error('Error adding note:', error);
      throw error;
    }
  },
  async updateNote({ dispatch }, note) {
    try {
      await api.put(`/notes/${note.id}/`, note);
      await dispatch('fetchNotes');
    } catch (error) {
      console.error('Error updating note:', error);
      throw error;
    }
  },
  async deleteNote({ dispatch }, noteId) {
    try {
      await api.delete(`/notes/${noteId}/`);
      await dispatch('fetchNotes');
    } catch (error) {
      console.error('Error deleting note:', error);
      throw error;
    }
  },
};

export default {
  namespaced: true,
  state,
  mutations,
  actions,
};
