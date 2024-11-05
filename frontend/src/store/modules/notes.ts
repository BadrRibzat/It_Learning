import { Module } from "vuex";
import api from "@/api";

interface Note {
  id: number;
  title: string;
  content: string;
}

interface NotesState {
  notes: Note[];
}

const notesModule: Module<NotesState, any> = {
  namespaced: true,
  state: {
    notes: [],
  },
  mutations: {
    SET_NOTES(state, notes: Note[]) {
      state.notes = notes;
    },
  },
  actions: {
    async fetchNotes({ commit }) {
      try {
        const response = await api.get("/notes/");
        commit("SET_NOTES", response.data);
        return response;
      } catch (error) {
        console.error("Error fetching notes:", error);
        throw error;
      }
    },
    async addNote({ dispatch }, note: Omit<Note, "id">) {
      try {
        await api.post("/notes/", note);
        await dispatch("fetchNotes");
      } catch (error) {
        console.error("Error adding note:", error);
        throw error;
      }
    },
    async updateNote({ dispatch }, note: Note) {
      try {
        await api.put(`/notes/${note.id}/`, note);
        await dispatch("fetchNotes");
      } catch (error) {
        console.error("Error updating note:", error);
        throw error;
      }
    },
    async deleteNote({ dispatch }, noteId: number) {
      try {
        await api.delete(`/notes/${noteId}/`);
        await dispatch("fetchNotes");
      } catch (error) {
        console.error("Error deleting note:", error);
        throw error;
      }
    },
  },
};

export default notesModule;
