import createBaseStore from './base';
import notesService from '@/services/api/notes';

const initialState = {
  notes: [],
  currentNote: null,
};

const { state, setState } = createBaseStore(initialState);

const actions = {
  async fetchNotes({ commit }) {
    try {
      const response = await notesService.getNotes();
      commit('setNotes', response.data);
    } catch (error) {
      console.error('Failed to fetch notes', error);
      throw error;
    }
  },
  async fetchNote({ commit }, id) {
    try {
      const response = await notesService.getNote(id);
      commit('setCurrentNote', response.data);
    } catch (error) {
      console.error('Failed to fetch note', error);
      throw error;
    }
  },
  async createNote({ commit }, noteData) {
    try {
      const response = await notesService.createNote(noteData);
      commit('addNote', response.data);
    } catch (error) {
      console.error('Failed to create note', error);
      throw error;
    }
  },
  async updateNote({ commit }, { id, noteData }) {
    try {
      const response = await notesService.updateNote(id, noteData);
      commit('updateNote', response.data);
    } catch (error) {
      console.error('Failed to update note', error);
      throw error;
    }
  },
  async deleteNote({ commit }, id) {
    try {
      await notesService.deleteNote(id);
      commit('removeNote', id);
    } catch (error) {
      console.error('Failed to delete note', error);
      throw error;
    }
  },
};

const mutations = {
  setNotes(state, notes) {
    state.notes = notes;
  },
  setCurrentNote(state, note) {
    state.currentNote = note;
  },
  addNote(state, note) {
    state.notes.push(note);
  },
  updateNote(state, updatedNote) {
    const index = state.notes.findIndex((n) => n.id === updatedNote.id);
    if (index !== -1) {
      state.notes.splice(index, 1, updatedNote);
    }
  },
  removeNote(state, id) {
    state.notes = state.notes.filter((n) => n.id !== id);
  },
};

export default {
  namespaced: true,
  state,
  actions,
  mutations,
};
