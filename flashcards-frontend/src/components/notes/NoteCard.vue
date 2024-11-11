<template>
  <div class="bg-white p-6 rounded-lg shadow-lg flex flex-col justify-between">
    <div>
      <div class="flex justify-between items-start mb-4">
        <h3 class="text-xl font-bold">{{ note.title }}</h3>
        <span 
          class="px-2 py-1 text-xs rounded-full uppercase"
          :class="noteTypeClasses"
        >
          {{ note.note_type }}
        </span>
      </div>
      <p class="text-gray-700 mb-4 line-clamp-3">{{ note.content }}</p>
    </div>
    
    <div class="flex justify-between items-center mt-4">
      <span class="text-sm text-gray-500">
        {{ formatDate(note.created_at) }}
      </span>
      <div class="flex space-x-2">
        <button 
          @click="$emit('edit', note)"
          class="text-primary hover:text-primary-dark transition-colors"
          aria-label="Edit Note"
        >
          <font-awesome-icon :icon="['fas', 'edit']" class="w-5 h-5" />
        </button>
        <button 
          @click="$emit('delete', note)"
          class="text-red-500 hover:text-red-700 transition-colors"
          aria-label="Delete Note"
        >
          <font-awesome-icon :icon="['fas', 'trash']" class="w-5 h-5" />
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';

const props = defineProps({
  note: {
    type: Object,
    required: true
  }
});

defineEmits(['edit', 'delete']);

const noteTypeClasses = computed(() => {
  const classes = {
    'general': 'bg-gray-100 text-gray-800',
    'vocabulary': 'bg-green-100 text-green-800',
    'grammar': 'bg-blue-100 text-blue-800'
  };
  return classes[props.note.note_type] || classes.general;
});

const formatDate = (dateString) => {
  if (!dateString) return '';
  const date = new Date(dateString);
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  }).format(date);
};
</script>
