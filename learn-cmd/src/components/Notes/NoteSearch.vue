<template>
  <div class="note-search mb-6">
    <div class="relative">
      <input
        type="text"
        v-model="searchQuery"
        placeholder="Search notes..."
        class="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
      />
      <i class="fas fa-search absolute right-4 top-3 text-gray-400"></i>
    </div>
  </div>
</template>

<script>
export default {
  name: "NoteSearch",
  data() {
    return {
      searchQuery: "",
    };
  },
  watch: {
    searchQuery(newQuery) {
      this.$emit("search", newQuery);
    },
  },
};
</script>
