<template>
  <div 
    class="lesson-card bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300"
    :class="{ 'opacity-75 cursor-not-allowed': !isUnlocked }"
  >
    <div class="p-6">
      <div class="flex items-center justify-between mb-4">
        <h3 class="text-lg font-semibold text-gray-900">
          {{ lesson.title }}
        </h3>
        <span 
          class="px-3 py-1 text-sm rounded-full"
          :class="statusClass"
        >
          {{ statusText }}
        </span>
      </div>
      
      <div class="space-y-4">
        <p class="text-sm text-gray-600">{{ lesson.description }}</p>
        
        <ProgressBar 
          :value="lesson.progress.completed_flashcards"
          :max="lesson.progress.total_flashcards"
          class="mb-2"
        />
        
        <div class="flex items-center justify-between text-sm text-gray-600">
          <span>
            {{ lesson.progress.completed_flashcards }}/{{ lesson.progress.total_flashcards }} Flashcards
          </span>
          <span v-if="lesson.progress.quiz_unlocked" class="text-primary-600">
            Quiz Available
          </span>
        </div>

        <button
          @click="handleLessonSelect"
          class="w-full px-4 py-2 text-sm font-medium rounded-md transition-colors"
          :class="buttonClass"
          :disabled="!isUnlocked"
        >
          {{ buttonText }}
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import type { Lesson } from '@/types/lessons';
import ProgressBar from '@/components/lessons/common/ProgressBar.vue';

const props = defineProps<{
  lesson: Lesson;
  isUnlocked: boolean;
}>();

const emit = defineEmits<{
  (e: 'select', lesson: Lesson): void;
}>();

const statusClass = computed(() => {
  if (!props.isUnlocked) return 'bg-gray-100 text-gray-600';
  if (props.lesson.completed) return 'bg-green-100 text-green-600';
  if (props.lesson.progress.completed_flashcards > 0) return 'bg-primary-100 text-primary-600';
  return 'bg-gray-100 text-gray-600';
});

const statusText = computed(() => {
  if (!props.isUnlocked) return 'Locked';
  if (props.lesson.completed) return 'Completed';
  if (props.lesson.progress.completed_flashcards > 0) return 'In Progress';
  return 'Not Started';
});

const buttonClass = computed(() => {
  if (!props.isUnlocked) {
    return 'bg-gray-100 text-gray-400 cursor-not-allowed';
  }
  return 'bg-primary-600 text-white hover:bg-primary-700';
});

const buttonText = computed(() => {
  if (!props.isUnlocked) return 'Locked';
  if (props.lesson.completed) return 'Review';
  if (props.lesson.progress.quiz_unlocked) return 'Take Quiz';
  if (props.lesson.progress.completed_flashcards > 0) return 'Continue';
  return 'Start Lesson';
});

const handleLessonSelect = () => {
  if (props.isUnlocked) {
    emit('select', props.lesson);
  }
};
</script>
