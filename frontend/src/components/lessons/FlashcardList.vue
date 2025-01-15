<template>
  <div>
    <div v-if="currentFlashcardIndex < props.flashcards.length">
      <Flashcard
        :flashcard="props.flashcards[currentFlashcardIndex]"
        @next="nextFlashcard"
      />
      <div class="mt-4 text-center">
        <p>Progress: {{ currentFlashcardIndex + 1 }} / {{ props.flashcards.length }}</p>
        <div class="w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-700 mt-2">
          <div
            class="bg-primary h-2.5 rounded-full"
            :style="{ width: `${(currentFlashcardIndex + 1) / props.flashcards.length * 100}%` }"
          ></div>
        </div>
      </div>
    </div>
    <div v-else class="text-center">
      <h3 class="text-2xl font-bold mb-4">Congratulations!</h3>
      <p>You've completed all flashcards for this lesson.</p>
      <button
        @click="completeFlashcards"
        class="mt-4 px-4 py-2 bg-primary text-white rounded hover:bg-primary-dark"
      >
        Back to Lesson
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import Flashcard from './Flashcard.vue';

// Define props directly without assigning to a variable
const props = defineProps({
  flashcards: {
    type: Array,
    required: true,
  },
});

const emit = defineEmits(['complete']);

const currentFlashcardIndex = ref(0);

const nextFlashcard = () => {
  currentFlashcardIndex.value++;
};

const completeFlashcards = () => {
  emit('complete');
};
</script>
