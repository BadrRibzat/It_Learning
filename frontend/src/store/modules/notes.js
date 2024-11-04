import { notesService } from '../../api/services/notesService';

const state = {
  notes: [],
};

const getters = {
  notes: (state) => state.notes,
};

const actions = {
  async fetchNotes({ commit }) {
    try {
      const notes = await notesService.fetchNotes();
      commit('setNotes', notes);
    } catch (error) {
      console.error('Fetch notes failed:', error);
      throw error;
    }
  },
  async createNote({ commit }, note) {
    try {
      const newNote = await notesService.createNote(note);
      commit('addNote', newNote);
    } catch (error) {
      console.error('Create note failed:', error);
      throw error;
    }
  },
  async updateNote({ commit }, { id, note }) {
    try {
      const updatedNote = await notesService.updateNote(id, note);
      commit('updateNote', updatedNote);
    } catch (error) {
      console.error('Update note failed:', error);
      throw error;
    }
  },
  async deleteNote({ commit }, id) {
    try {
      await notesService.deleteNote(id);
      commit('removeNote', id);
    } catch (error) {
      console.error('Delete note failed:', error);
      throw error;
    }
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
    const index = state.notes.findIndex(note => note.id === updatedNote.id);
    if (index !== -1) {
      state.notes.splice(index, 1, updatedNote);
    }
  },
  removeNote(state, id) {
    state.notes = state.notes.filter(note => note.id !== id);
  },
};

export default {
  state,
  getters,
  actions,
  mutations,
};
