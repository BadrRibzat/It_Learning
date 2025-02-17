<template>
  <div class="lesson-card bg-white p-6 rounded-lg shadow">
    <div class="lesson-card-content" @click="$emit('select-lesson', lesson)">
      <h3 class="text-xl font-bold mb-4">{{ lesson.title }}</h3>
      <p class="text-gray-600">{{ lesson.description }}</p>
    </div>

    <div class="mt-4 flex justify-between items-center">
      <span v-if="progress.completed" class="text-green-500 font-medium">Completed (+10 points)</span>
      <span v-else class="text-gray-500 font-medium">Not completed</span>

      <button
        class="px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700"
        @click.stop="$emit('start-lesson', lesson)"
        :disabled="!progress.completed"
      >
        {{ progress.completed ? 'View Quiz' : 'Start Lesson' }}
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { defineProps, defineEmits } from 'vue';
import type { Lesson } from '@/types/lessons';

const props = defineProps<{
  lesson: Lesson;
  progress: {
    completed: boolean;
    points: number;
    total_points: number;
  };
}>();

console.log('LessonCard props:', props);

const emit = defineEmits(['select-lesson', 'start-lesson']);
</script>

<style scoped>
.lesson-card {
  transition: transform 0.2s ease-in-out;
}

.lesson-card:hover {
  transform: scale(1.05);
}

.lesson-card-content {
  cursor: pointer;
}
</style>
