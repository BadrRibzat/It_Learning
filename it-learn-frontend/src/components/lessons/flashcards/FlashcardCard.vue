<template>
  <div 
    class="flashcard-container"
    :class="{ 'is-flipped': isFlipped }"
  >
    <!-- Front Side -->
    <div 
      class="flashcard-side front p-6"
      @click="handleFlip"
    >
      <div class="h-full flex flex-col">
        <div class="bg-gray-50 rounded-lg p-6 flex-grow">
          <slot name="front"></slot>
        </div>
        <div class="mt-4 text-center text-gray-500">
          <p>Click to flip card</p>
        </div>
      </div>
    </div>

    <!-- Back Side -->
    <div class="flashcard-side back">
      <div class="p-6 space-y-4">
        <h3 class="text-lg font-semibold text-gray-900">
          {{ flashcard.question }}
        </h3>
        
        <div v-if="!hasSubmitted">
          <input
            v-model="userAnswer"
            type="text"
            class="w-full p-2 border border-gray-300 rounded-md"
            placeholder="Type your answer..."
            @keyup.enter="submitAnswer"
          />

          <button
            @click="submitAnswer"
            class="w-full mt-4 px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700"
            :disabled="!userAnswer.trim()"
          >
            Submit Answer
          </button>
        </div>

        <div v-else class="space-y-4">
          <div :class="isCorrect ? 'text-green-600' : 'text-red-600'" class="text-center">
            <p class="text-lg font-medium">
              {{ isCorrect ? 'Correct!' : 'Incorrect!' }}
            </p>
            <p v-if="!isCorrect" class="mt-2 text-sm">
              Correct answer: {{ flashcard.answer }}
            </p>
          </div>

          <button
            v-if="isCorrect"
            @click="handleNext"
            class="w-full px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
          >
            Next Card
          </button>

          <button
            v-else
            @click="tryAgain"
            class="w-full px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
          >
            Try Again
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import type { Flashcard } from '@/types/lessons';

const props = defineProps<{
  flashcard: Flashcard;
  showFeedback?: boolean;
}>();

const emit = defineEmits<{
  (e: 'answer-submitted', answer: string): void;
  (e: 'next'): void;
}>();

const isFlipped = ref(false);
const userAnswer = ref('');
const isCorrect = ref(false);
const hasSubmitted = ref(false);

const handleFlip = () => {
  if (!isFlipped.value) {
    isFlipped.value = true;
  }
};

const submitAnswer = () => {
  if (!userAnswer.value.trim()) return;
  
  hasSubmitted.value = true;
  isCorrect.value = userAnswer.value.trim().toLowerCase() === props.flashcard.answer.toLowerCase();
  emit('answer-submitted', userAnswer.value);
};

const handleNext = () => {
  isFlipped.value = false;
  hasSubmitted.value = false;
  userAnswer.value = '';
  emit('next');
};

const tryAgain = () => {
  hasSubmitted.value = false;
  userAnswer.value = '';
};
</script>

<style scoped>
.flashcard-container {
  perspective: 1000px;
  height: 400px;
  position: relative;
  transform-style: preserve-3d;
  transition: transform 0.6s;
  background: transparent;
}

.flashcard-container.is-flipped {
  transform: rotateY(180deg);
}

.flashcard-side {
  position: absolute;
  width: 100%;
  height: 100%;
  backface-visibility: hidden;
  background: white;
  border-radius: 0.5rem;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  overflow: auto;
}

.front {
  cursor: pointer;
  background: white;
  border: 1px solid #e5e7eb;
}

.back {
  transform: rotateY(180deg);
  background: white;
  border: 1px solid #e5e7eb;
}

.flashcard-side .content {
  padding: 1.5rem;
}
</style>