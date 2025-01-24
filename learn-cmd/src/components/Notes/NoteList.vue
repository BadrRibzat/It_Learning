<template>
  <div class="note-list">
    <div v-if="notes.length === 0" class="text-center text-gray-600">
      No notes found.
    </div>
    <div v-else>
      <div
        v-for="note in filteredNotes"
        :key="note.id"
        class="note-item bg-white shadow-md rounded-lg p-6 mb-4"
      >
        <div class="flex justify-between items-center">
          <h3 class="text-xl font-bold text-primary">{{ note.title }}</h3>
          <div class="flex space-x-4">
            <button
              @click="editNote(note)"
              class="text-gray-600 hover:text-primary transition-colors"
            >
              <i class="fas fa-edit"></i>
            </button>
            <button
              @click="deleteNote(note.id)"
              class="text-gray-600 hover:text-red-600 transition-colors"
            >
              <i class="fas fa-trash"></i>
            </button>
          </div>
        </div>
        <p class="text-gray-600 mt-2">{{ note.content }}</p>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "NoteList",
  props: {
    notes: {
      type: Array,
      required: true,
    },
    searchQuery: {
      type: String,
      default: "",
    },
  },
  computed: {
    filteredNotes() {
      return this.notes.filter(
        (note) =>
          note.title.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
          note.content.toLowerCase().includes(this.searchQuery.toLowerCase())
      );
    },
  },
  methods: {
    editNote(note) {
      this.$emit("edit-note", note);
    },
    deleteNote(noteId) {
      this.$emit("delete-note", noteId);
    },
  },
};
</script>

<style scoped>
.note-item {
  transition: transform 0.2s ease-in-out;
}
.note-item:hover {
  transform: translateY(-2px);
}
</style>
