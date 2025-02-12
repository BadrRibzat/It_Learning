<template>
  <div class="flashcard-question space-y-4">
    <div class="question-content">
      <h3 class="text-lg font-semibold text-gray-900 mb-2">
        {{ question }}
      </h3>
      
      <div class="answer-input space-y-2">
        <input
          v-model="localAnswer"
          type="text"
          class="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
          :placeholder="placeholder"
          :disabled="disabled"
          @keyup.enter="handleSubmit"
        />
        
        <div v-if="showFeedback" class="feedback-message">
          <p :class="feedbackClass" class="text-sm font-medium">
            {{ feedbackMessage }}
          </p>
        </div>
      </div>

      <div class="mt-4 flex justify-center">
        <button
          v-if="!hasSubmitted"
          @click="handleSubmit"
          class="px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 disabled:opacity-50"
          :disabled="!localAnswer || disabled"
        >
          Submit Answer
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';

const props = defineProps<{
  question: string;
  placeholder?: string;
  disabled?: boolean;
  showFeedback?: boolean;
  isCorrect?: boolean;
}>();

const emit = defineEmits<{
  (e: 'submit', answer: string): void;
}>();

const localAnswer = ref('');
const hasSubmitted = ref(false);

const feedbackClass = computed(() => {
  return props.isCorrect ? 'text-green-600' : 'text-red-600';
});

const feedbackMessage = computed(() => {
  if (!props.showFeedback) return '';
  return props.isCorrect ? 'Correct! Well done!' : 'Incorrect. Try again!';
});

const handleSubmit = () => {
  if (!localAnswer.value || props.disabled) return;
  
  hasSubmitted.value = true;
  emit('submit', localAnswer.value);
};
</script>