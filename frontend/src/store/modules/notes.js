import axiosInstance from '../../api/axios';

const state = {
  notes: [],
};

const getters = {
  notes: (state) => state.notes,
};

const actions = {
  async fetchNotes({ commit }) {
    const response = await axiosInstance.get('notes/');
    commit('setNotes', response.data);
  },
  async addNote({ commit }, note) {
    const response = await axiosInstance.post('notes/', note);
    commit('addNote', response.data);
  },
  async updateNote({ commit }, note) {
    const response = await axiosInstance.put(`notes/${note.id}/`, note);
    commit('updateNote', response.data);
  },
  async deleteNote({ commit }, noteId) {
    await axiosInstance.delete(`notes/${noteId}/`);
    commit('deleteNote', noteId);
  },
};

const mutations = {
  setNotes(state, notes) {
    state.notes = notes;
  },
  addNote(state, note) {
    state.notes.push(note);
  },
  updateNote(state, updatedNote) {
    const index = state.notes.findIndex((note) => note.id === updatedNote.id);
    if (index !== -1) {
      state.notes.splice(index, 1, updatedNote);
    }
  },
  deleteNote(state, noteId) {
    state.notes = state.notes.filter((note) => note.id !== noteId);
  },
};

export default {
  state,
  getters,
  actions,
  mutations,
};
