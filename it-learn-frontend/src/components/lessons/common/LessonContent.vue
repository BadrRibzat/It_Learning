<template>
  <div class="lesson-content">
    <ProgressBar :value="currentStep" :max="totalSteps" />

    <div class="flex justify-between items-center mt-4">
      <span>Progress: {{ currentStep }}/{{ totalSteps }}</span>
      <span>{{ progressPercentage }}% Complete</span>
    </div>

    <div v-if="content" class="content mt-4">
      <slot name="content"></slot>
    </div>

    <div class="flex justify-between mt-4">
      <button 
        @click="$emit('previous')"
        :disabled="currentStep === 1"
        class="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 disabled:opacity-50"
      >
        Previous
      </button>

      <button 
        @click="$emit('next')"
        :disabled="currentStep === totalSteps"
        class="px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 disabled:opacity-50"
      >
        {{ currentStep === totalSteps ? 'Complete' : 'Next' }}
      </button>
    </div>

    <div class="quiz-access mt-4">
      <button 
        @click="goToQuiz"
        class="px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700"
      >
        Go to Quiz
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import ProgressBar from '@/components/lessons/common/ProgressBar.vue';
import { computed } from 'vue';

const props = defineProps<{
  currentStep: number;
  totalSteps: number;
  content: any;
}>();

const emit = defineEmits(['previous', 'next']);

const progressPercentage = computed(() => {
  return Math.round((props.currentStep / props.totalSteps) * 100);
});

const goToQuiz = () => {
  emit('go-to-quiz');
};
</script>

<style scoped>
.lesson-content {
  margin-top: 2rem;
}
</style>
