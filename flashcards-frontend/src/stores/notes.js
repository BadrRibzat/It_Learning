import notesService from '@/services/api/notes';

export default {
    namespaced: true,
    state: () => ({
        notes: [],
        currentNote: null,
        isEditing: false,
        editingNote: null,
    }),
    actions: {
        async fetchNotes({ commit }) {
            try {
                const response = await notesService.getNotes();
                commit('setNotes', response.data);
            } catch (error) {
                console.error('Failed to fetch notes', error);
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
                commit('setEditing', false);
            } catch (error) {
                console.error('Failed to update note', error);
                throw error;
            }
        },
        async deleteNote({ commit }, id) {
            try {
                const confirmed = window.confirm('Are you sure you want to delete this note?');
                if (confirmed) {
                    await notesService.deleteNote(id);
                    commit('removeNote', id);
                    // Optional: Show success notification
                    this.dispatch('app/showNotification', {
                        message: 'Note deleted successfully',
                        type: 'success'
                    });
                }
            } catch (error) {
                console.error('Failed to delete note:', error);
                // Show error notification
                this.dispatch('app/showNotification', {
                    message: error.message || 'Failed to delete note',
                    type: 'error'
                });
                throw error;
            }
        },
        startEditing({ commit }, note) {
            commit('setEditingNote', note);
            commit('setEditing', true);
        },
        cancelEditing({ commit }) {
            commit('setEditingNote', null);
            commit('setEditing', false);
        },
    },
    mutations: {
        setNotes(state, notes) {
            state.notes = notes;
        },
        addNote(state, note) {
            state.notes.push(note);
        },
        updateNote(state, updatedNote) {
            const index = state.notes.findIndex(n => n.id === updatedNote.id);
            if (index !== -1) {
                state.notes.splice(index, 1, updatedNote);
            }
        },
        removeNote(state, id) {
            state.notes = state.notes.filter(n => n.id !== id);
        },
        setEditing(state, isEditing) {
            state.isEditing = isEditing;
        },
        setEditingNote(state, note) {
            state.editingNote = note;
        },
    }
};
