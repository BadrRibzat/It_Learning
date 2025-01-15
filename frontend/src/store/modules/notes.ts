import { Module } from "vuex";
import { RootState } from "@/store";
import api from "@/api";

export interface Note {
  id: number;
  user: number;
  title: string;
  content: string;
  created_at: string;
  updated_at: string;
  note_type: string;
}

export interface NotesState {
  notes: Note[];
}

const notesModule: Module<NotesState, RootState> = {
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
    async addNote(
      { dispatch },
      note: Omit<Note, "id" | "user" | "created_at" | "updated_at">
    ) {
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
