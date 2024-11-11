<template>
  <div class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
    <div class="bg-white p-6 rounded-lg shadow-xl w-full max-w-md">
      <h2 class="text-2xl font-bold mb-4">Edit Note</h2>
      <form @submit.prevent="submitUpdate" class="space-y-4">
        <div>
          <label class="block text-sm font-medium text-gray-700">Title</label>
          <input
            v-model="editedNote.title"
            type="text"
            class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary"
            :maxlength="config.validation.maxNoteTitleLength"
            required
          />
          <p 
            v-if="titleError" 
            class="text-red-500 text-sm mt-1"
          >
            {{ titleError }}
          </p>
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700">Content</label>
          <textarea
            v-model="editedNote.content"
            rows="4"
            class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary"
            :maxlength="config.validation.maxNoteContentLength"
            required
          ></textarea>
          <p 
            v-if="contentError" 
            class="text-red-500 text-sm mt-1"
          >
            {{ contentError }}
          </p>
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700">Note Type</label>
          <select
            v-model="editedNote.note_type"
            class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary"
          >
            <option value="general">General</option>
            <option value="vocabulary">Vocabulary</option>
            <option value="grammar">Grammar</option>
          </select>
        </div>
        <div class="flex justify-between">
          <button
            type="button"
            @click="$emit('cancel')"
            class="bg-gray-200 text-gray-800 py-2 px-4 rounded-md hover:bg-gray-300"
          >
            Cancel
          </button>
          <button
            type="submit"
            class="bg-primary text-white py-2 px-4 rounded-md hover:bg-primary-dark"
            :disabled="!isFormValid"
          >
            Update Note
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import { APP_CONFIG } from '@/config';
import { useStore } from 'vuex';

const config = APP_CONFIG;
const store = useStore();

const props = defineProps({
  note: {
    type: Object,
    required: true
  }
});

const emit = defineEmits(['update', 'cancel']);

// Create a copy of the note to avoid direct mutation
const editedNote = ref({ ...props.note });

// Validation
const titleError = computed(() => {
  const title = editedNote.value.title;
  if (!title) return 'Title is required';
  if (title.length < 3) return 'Title must be at least 3 characters';
  if (title.length > 100) return 'Title cannot exceed 100 characters';
  return '';
});

const contentError = computed(() => {
  const content = editedNote.value.content;
  if (!content) return 'Content is required';
  if (content.length < 10) return 'Content must be at least 10 characters';
  if (content.length > 1000) return 'Content cannot exceed 1000 characters';
  return '';
});

const isFormValid = computed(() => {
  return !titleError.value && !contentError.value;
});

const submitUpdate = async () => {
  if (!isFormValid.value) {
    store.dispatch('app/showNotification', {
      message: 'Please fix the errors before submitting',
      type: 'error'
    });
    return;
  }

  try {
    emit('update', editedNote.value);
  } catch (error) {
    store.dispatch('app/showNotification', {
      message: error.message || 'Failed to update note',
      type: 'error'
    });
  }
};
</script>
