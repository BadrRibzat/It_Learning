<template>
  <div class="notes-management">
    <h1>Notes Management</h1>
    <div v-if="notes.length">
      <div v-for="note in notes" :key="note.id" class="note">
        <h2>{{ note.title }}</h2>
        <p>{{ note.content }}</p>
        <button @click="editNote(note.id)">Edit</button>
        <button @click="deleteNote(note.id)">Delete</button>
      </div>
    </div>
    <div v-else>
      <p>Loading notes...</p>
    </div>
    <button @click="addNote">Add Note</button>
  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex';

export default {
  name: 'NotesManagementComponent',
  computed: {
    ...mapGetters(['notes']),
  },
  methods: {
    ...mapActions(['fetchNotes', 'deleteNote']),
    editNote(noteId) {
      // Logic to edit note
      console.log(`Edit note ${noteId}`);
    },
    addNote() {
      // Logic to add note
      console.log('Add note');
    },
  },
  async created() {
    await this.fetchNotes();
  },
};
</script>

<style scoped>
.notes-management {
  padding: 2rem;
}

.note {
  margin-bottom: 2rem;
}

button {
  background-color: #42b983;
  color: white;
  border: none;
  padding: 0.5rem 1rem;
  margin-top: 1rem;
  cursor: pointer;
}

button:hover {
  background-color: #35495e;
}
</style>
