<template>
  <div class="quiz-card">
    <h3>Quiz: {{ quiz.title }}</h3>
    <p>{{ quiz.description }}</p>
    <button @click="startQuiz">Start Quiz</button>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import type { Quiz } from '@/types/lessons';

export default defineComponent({
  props: {
    quiz: {
      type: Object as () => Quiz,
      required: true,
    },
  },
  methods: {
    startQuiz() {
      this.$emit('start-quiz');
    },
  },
});
</script>

<style scoped>
.quiz-card {
  border: 1px solid #ccc;
  padding: 16px;
  margin: 8px;
  border-radius: 8px;
}
</style>
