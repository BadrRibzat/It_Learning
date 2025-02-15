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
        
        <div class="flex items-center justify-between text-sm text-gray-600">
          <span v-if="lesson.completed" class="text-green-600">
            Completed (+10 points)
          </span>
          <span v-else>
            Not completed
          </span>
          <button
            v-if="!lesson.completed"
            @click="$emit('take-quiz', lesson)"
            class="text-primary-600 hover:text-primary-700"
          >
            Take Quiz
          </button>
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
  (e: 'take-quiz', lesson: Lesson): void;
}>();

const statusClass = computed(() => {
  if (!props.isUnlocked) return 'bg-gray-100 text-gray-600';
  if (props.lesson.completed) return 'bg-green-100 text-green-600';
  return 'bg-primary-100 text-primary-600';
});

const statusText = computed(() => {
  if (!props.isUnlocked) return 'Locked';
  if (props.lesson.completed) return 'Completed';
  return 'Available';
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
  if (props.lesson.progress && props.lesson.progress.quiz_unlocked && props.lesson.progress.completed_flashcards === props.lesson.progress.total_flashcards) return 'Take Quiz';
  if (props.lesson.progress && props.lesson.progress.completed_flashcards ? props.lesson.progress.completed_flashcards > 0 : false) return 'Continue';
  return 'Start Lesson';
});

const handleLessonSelect = () => {
  if (props.isUnlocked) {
    emit('select', props.lesson);
  }
};
</script>

<style scoped>
.lesson-card {
  transition: transform 0.3s;
}
.lesson-card:hover {
  transform: translateY(-5px);
}
</style>
