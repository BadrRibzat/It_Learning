<template>
  <div class="flashcard-progress">
    <h4>Flashcard Progress</h4>
    <p>{{ completedFlashcards }} / {{ totalFlashcards }} Completed</p>
    <button v-if="allFlashcardsCompleted" @click="goToQuiz">Go to Quiz</button>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import type { Lesson } from '@/types/lessons';

export default defineComponent({
  props: {
    lesson: {
      type: Object as () => Lesson,
      required: true,
    },
  },
  computed: {
    completedFlashcards(): number {
      return this.lesson.progress.completed_flashcards;
    },
    totalFlashcards(): number {
      return this.lesson.progress.total_flashcards;
    },
    allFlashcardsCompleted(): boolean {
      return this.completedFlashcards >= this.totalFlashcards;
    },
  },
  methods: {
    goToQuiz() {
      this.$emit('go-to-quiz');
    },
  },
});
</script>

<style scoped>
.flashcard-progress {
  border: 1px solid #ccc;
  padding: 16px;
  margin: 8px;
  border-radius: 8px;
}
</style>
