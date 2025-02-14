<template>
  <div class="flashcards-view">
    <h3>Flashcards</h3>
    <Flashcard 
      v-for="flashcard in flashcards" 
      :key="flashcard.id" 
      :flashcard="flashcard" 
      @answered="handleAnswer"
    />
    <button v-if="allFlashcardsCompleted" @click="goToQuiz">Go to Quiz</button>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import Flashcard from './Flashcard.vue';
import type { Flashcard } from '@/types/lessons';

export default defineComponent({
  components: { Flashcard },
  props: {
    lessonId: {
      type: String,
      required: true,
    },
  },
  data() {
    return {
      flashcards: [] as Flashcard[],
      completedFlashcards: 0,
    };
  },
  computed: {
    allFlashcardsCompleted(): boolean {
      return this.completedFlashcards >= 10;
    },
  },
  async mounted() {
    try {
      const lessonsStore = useLessonsStore();
      this.flashcards = await lessonsStore.getFlashcards(this.lessonId);
    } catch (error) {
      console.error('Error fetching flashcards:', error);
    }
  },
  methods: {
    handleAnswer(response: any) {
      this.completedFlashcards++;
      if (response.progress.quiz_unlocked) {
        this.$emit('quiz-unlocked', response);
      }
    },
    goToQuiz() {
      this.$emit('quiz-unlocked', { redirect_to_quiz: true });
    },
  },
});
</script>
