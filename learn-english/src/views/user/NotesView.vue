<template>
  <div class="notes-view p-10">
    <h1 class="text-4xl font-bold text-center text-primary mb-8">Notes</h1>

    <!-- Note Search -->
    <NoteSearch @search="handleSearch" />

    <!-- Note Form (Conditional Rendering) -->
    <NoteForm
      v-if="showForm"
      :noteToEdit="noteToEdit"
      @submit-note="handleSubmitNote"
      @cancel-form="handleCancelForm"
    />

    <!-- Note List or Empty State -->
    <div v-if="!showForm">
      <NoteList
        v-if="notes.length > 0"
        :notes="notes"
        :searchQuery="searchQuery"
        @edit-note="handleEditNote"
        @delete-note="handleDeleteNote"
      />
      <div v-else class="text-center text-gray-600">
        <p>No notes found.</p>
        <button
          @click="handleAddNote"
          class="mt-4 bg-primary hover:bg-primary-dark text-white font-bold py-2 px-4 rounded focus:outline-none focus:ring-2 focus:ring-primary"
        >
          <i class="fas fa-plus mr-2"></i>Add Your First Note
        </button>
      </div>
    </div>

    <!-- Add Note Button (Visible only when there are notes) -->
    <button
      v-if="!showForm && notes.length > 0"
      @click="handleAddNote"
      class="fixed bottom-10 right-10 bg-primary hover:bg-primary-dark text-white font-bold py-3 px-6 rounded-full shadow-lg focus:outline-none focus:ring-2 focus:ring-primary"
    >
      <i class="fas fa-plus"></i>
    </button>
  </div>
</template>

<script>
import NoteList from "@/components/Notes/NoteList.vue";
import NoteForm from "@/components/Notes/NoteForm.vue";
import NoteSearch from "@/components/Notes/NoteSearch.vue";

export default {
  name: "NotesView",
  components: {
    NoteList,
    NoteForm,
    NoteSearch,
  },
  data() {
    return {
      notes: [], // Start with an empty array
      showForm: false,
      noteToEdit: { title: "", content: "" }, // Initialize with an empty object
      searchQuery: "",
    };
  },
  methods: {
    handleSearch(query) {
      this.searchQuery = query;
    },
    handleAddNote() {
      this.noteToEdit = { title: "", content: "" }; // Reset noteToEdit for new note
      this.showForm = true;
    },
    handleEditNote(note) {
      this.noteToEdit = { ...note }; // Set noteToEdit to the note being edited
      this.showForm = true;
    },
    handleSubmitNote(note) {
      if (note.id) {
        // Update existing note
        const index = this.notes.findIndex((n) => n.id === note.id);
        this.notes.splice(index, 1, note);
      } else {
        // Add new note
        note.id = Date.now(); // Simple ID generation
        this.notes.push(note);
      }
      this.showForm = false;
    },
    handleCancelForm() {
      this.showForm = false;
    },
    handleDeleteNote(noteId) {
      this.notes = this.notes.filter((note) => note.id !== noteId);
    },
  },
};
</script>

<style scoped>
.notes-view {
  max-width: 800px;
  margin: 0 auto;
}
</style>
