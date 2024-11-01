<template>
  <div>
    <div v-if="currentIndex < flashcards.length">
      <Flashcard
        :flashcard="flashcards[currentIndex]"
        @next="nextFlashcard"
      />
      <div class="mt-4 text-center">
        <p>Progress: {{ currentIndex + 1 }} / {{ flashcards.length }}</p>
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

const props = defineProps({
  flashcards: {
    type: Array,
    required: true,
  },
});

const emit = defineEmits(['complete']);

const currentIndex = ref(0);

const nextFlashcard = () => {
  currentIndex.value++;
};

const completeFlashcards = () => {
  emit('complete');
};
</script>
