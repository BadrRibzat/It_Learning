<template>
  <div class="note-form bg-white shadow-md rounded-lg p-6">
    <h2 class="text-2xl font-bold text-primary mb-4">
      {{ isEditMode ? "Edit Note" : "Create Note" }}
    </h2>
    <form @submit.prevent="submitForm">
      <div class="mb-4">
        <label for="title" class="block text-gray-700 font-bold mb-2">Title</label>
        <input
          type="text"
          id="title"
          v-model="note.title"
          class="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
          required
        />
      </div>
      <div class="mb-4">
        <label for="content" class="block text-gray-700 font-bold mb-2">Content</label>
        <textarea
          id="content"
          v-model="note.content"
          class="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
          rows="5"
          required
        ></textarea>
      </div>
      <div class="flex justify-end space-x-4">
        <button
          type="button"
          @click="cancelForm"
          class="bg-gray-500 hover:bg-gray-600 text-white font-bold py-2 px-4 rounded focus:outline-none focus:ring-2 focus:ring-gray-500"
        >
          Cancel
        </button>
        <button
          type="submit"
          class="bg-primary hover:bg-primary-dark text-white font-bold py-2 px-4 rounded focus:outline-none focus:ring-2 focus:ring-primary"
        >
          {{ isEditMode ? "Update" : "Create" }}
        </button>
      </div>
    </form>
  </div>
</template>

<script>
export default {
  name: "NoteForm",
  props: {
    noteToEdit: {
      type: Object,
      default: () => ({ title: "", content: "" }), // Default to an empty object
    },
  },
  data() {
    return {
      note: { ...this.noteToEdit }, // Initialize with the prop value
      isEditMode: !!this.noteToEdit?.id, // Check if noteToEdit has an id
    };
  },
  methods: {
    submitForm() {
      this.$emit("submit-note", this.note);
    },
    cancelForm() {
      this.$emit("cancel-form");
    },
  },
};
</script>
