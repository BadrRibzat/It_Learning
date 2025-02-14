<template>
  <div class="quiz-results">
    <h3>Quiz Results</h3>
    <p>Score: {{ score }}% ({{ correctAnswers }} / {{ totalQuestions }})</p>
    <p v-if="passed">Congratulations! You passed the quiz.</p>
    <p v-else>You need to score at least {{ requiredScore }}% to pass.</p>
    <button v-if="nextLessonUnlocked" @click="goToNextLesson">Go to Next Lesson</button>
    <button v-else @click="retryQuiz">Retry Quiz</button>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import type { QuizSubmissionResponse } from '@/types/lessons';

export default defineComponent({
  props: {
    results: {
      type: Object as () => QuizSubmissionResponse,
      required: true,
    },
  },
  computed: {
    score(): number {
      return this.results.score;
    },
    correctAnswers(): number {
      return this.results.correct_answers;
    },
    totalQuestions(): number {
      return this.results.total_questions;
    },
    passed(): boolean {
      return this.results.passed;
    },
    requiredScore(): number {
      return this.results.required_score;
    },
    nextLessonUnlocked(): boolean {
      return this.results.next_lesson_unlocked;
    },
  },
  methods: {
    goToNextLesson() {
      this.$router.push('/next-lesson');
    },
    retryQuiz() {
      this.$router.go(0); // Reload the current page
    },
  },
});
</script>

<style scoped>
.quiz-results {
  border: 1px solid #ccc;
  padding: 16px;
  margin: 8px;
  border-radius: 8px;
}

button {
  margin-top: 16px;
}
</style>
