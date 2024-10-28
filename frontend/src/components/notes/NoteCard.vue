<template>
  <div class="bg-white rounded-lg shadow-md p-4">
    <h3 class="text-xl font-bold mb-2">{{ note.title }}</h3>
    <p class="text-gray-600">{{ note.content }}</p>
    <div class="mt-4 flex justify-end">
      <button
        @click="editNote"
        class="inline-flex items-center px-3 py-2 border border-transparent text-sm font-medium rounded-md text-primary bg-primary-50 hover:bg-primary-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
      >
        Edit
      </button>
      <button
        @click="deleteNote"
        class="ml-2 inline-flex items-center px-3 py-2 border border-transparent text-sm font-medium rounded-md text-red-600 bg-red-50 hover:bg-red-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
      >
        Delete
      </button>
    </div>
  </div>
</template>

<script setup>
import { defineEmits } from 'vue';

const emit = defineEmits(['edit', 'delete']);

defineProps({
  note: {
    type: Object,
    required: true,
  },
});

const editNote = () => {
  emit('edit', props.note);
};

const deleteNote = () => {
  emit('delete', props.note.id);
};
</script>
