<template>
  <div class="flashcards-view">
    <h2>Flashcards: {{ lesson.title }}</h2>
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
import { useLessonsStore } from '@/stores/lessons';
import Flashcard from '@/components/lessons/flashcards/Flashcard.vue';

export default defineComponent({
  components: { Flashcard },
  props: ['lessonId'],
  setup() {
    const lessonsStore = useLessonsStore();
    return { lessonsStore };
  },
  data() {
    return {
      flashcards: [] as any[],
      completedFlashcards: 0,
    };
  },
  computed: {
    allFlashcardsCompleted(): boolean {
      return this.completedFlashcards >= 10;
    },
  },
  async mounted() {
    this.flashcards = await this.lessonsStore.getFlashcards(this.lessonId);
  },
  methods: {
    async handleAnswer(response: any) {
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
