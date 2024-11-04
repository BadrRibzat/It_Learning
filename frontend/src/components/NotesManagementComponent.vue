<template>
  <div class="notes-management">
    <h1>Notes Management</h1>
    <div v-if="loading">
      <p>Loading notes...</p>
    </div>
    <div v-else-if="notes.length">
      <div v-for="note in notes" :key="note.id" class="note">
        <h2>{{ note.title }}</h2>
        <p>{{ note.content }}</p>
        <button @click="editNote(note)">Edit</button>
        <button @click="deleteNote(note.id)">Delete</button>
      </div>
    </div>
    <div v-else>
      <p>No notes available. Create your first note!</p>
    </div>
    <button @click="showAddNoteForm = true">Add Note</button>

    <div v-if="showAddNoteForm" class="note-form">
      <h2>{{ editingNote ? 'Edit Note' : 'Add Note' }}</h2>
      <form @submit.prevent="submitNote">
        <input v-model="noteForm.title" placeholder="Title" required>
        <textarea v-model="noteForm.content" placeholder="Content" required></textarea>
        <button type="submit">{{ editingNote ? 'Update' : 'Add' }}</button>
        <button type="button" @click="cancelForm">Cancel</button>
      </form>
    </div>
  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex';

export default {
  name: 'NotesManagementComponent',
  data() {
    return {
      showAddNoteForm: false,
      noteForm: {
        title: '',
        content: '',
      },
      editingNote: null,
      loading: true,
    };
  },
  computed: {
    ...mapGetters(['notes']),
  },
  methods: {
    ...mapActions(['fetchNotes', 'createNote', 'updateNote', 'deleteNote']),
    editNote(note) {
      this.editingNote = note;
      this.noteForm = { ...note };
      this.showAddNoteForm = true;
    },
    async submitNote() {
      try {
        if (this.editingNote) {
          await this.updateNote({ id: this.editingNote.id, note: this.noteForm });
        } else {
          await this.createNote(this.noteForm);
        }
        this.cancelForm();
        await this.fetchNotes();
      } catch (error) {
        console.error('Failed to submit note:', error);
        alert('Failed to save note. Please try again.');
      }
    },
    async deleteNote(noteId) {
      if (confirm('Are you sure you want to delete this note?')) {
        try {
          await this.deleteNote(noteId);
          await this.fetchNotes();
        } catch (error) {
          console.error('Failed to delete note:', error);
          alert('Failed to delete note. Please try again.');
        }
      }
    },
    cancelForm() {
      this.showAddNoteForm = false;
      this.noteForm = { title: '', content: '' };
      this.editingNote = null;
    },
  },
  async created() {
    try {
      await this.fetchNotes();
    } catch (error) {
      console.error('Failed to fetch notes:', error);
    } finally {
      this.loading = false;
    }
  },
};
</script>

<style scoped>
.notes-management {
  padding: 2rem;
}

.note {
  margin-bottom: 2rem;
  border: 1px solid #ccc;
  padding: 1rem;
  border-radius: 4px;
}

.note-form {
  margin-top: 2rem;
  border: 1px solid #ccc;
  padding: 1rem;
  border-radius: 4px;
}

input, textarea {
  width: 100%;
  padding: 0.5rem;
  margin-bottom: 1rem;
}

textarea {
  height: 100px;
}

button {
  background-color: #42b983;
  color: white;
  border: none;
  padding: 0.5rem 1rem;
  margin-right: 0.5rem;
  cursor: pointer;
}

button:hover {
  background-color: #35495e;
}
</style>
