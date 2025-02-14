<template>
  <div class="level-test-results">
    <h3>Test Results</h3>
    <p>Score: {{ score }}% ({{ correctAnswers }} / {{ totalQuestions }})</p>
    <p v-if="passed">Congratulations! You passed the test.</p>
    <p v-else>You need to score at least {{ requiredScore }}% to pass.</p>
    <button v-if="nextLevelUnlocked" @click="goToNextLevel">Go to Next Level</button>
    <button v-else @click="retryTest">Retry Test</button>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { TestSubmissionResponse } from '@/types/lessons';

export default defineComponent({
  props: {
    results: {
      type: Object as () => TestSubmissionResponse,
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
    nextLevelUnlocked(): boolean {
      return this.results.next_level_unlocked;
    },
  },
  methods: {
    goToNextLevel() {
      this.$router.push('/next-level');
    },
    retryTest() {
      this.$router.push(`/levels/${this.$route.params.levelId}/test`);
    },
  },
});
</script>

<style scoped>
.level-test-results {
  border: 1px solid #ccc;
  padding: 16px;
  margin: 8px;
  border-radius: 8px;
}

button {
  margin-top: 16px;
}
</style>
