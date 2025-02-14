<template>
  <div class="quiz-view">
    <h3>Quiz</h3>
    <QuizQuestion 
      v-for="question in quiz.questions" 
      :key="question.id" 
      :question="question" 
      @answered="handleAnswer"
    />
    <button @click="submitQuiz">Submit Quiz</button>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import QuizQuestion from './QuizQuestion.vue';
import type { Quiz } from '@/types/lessons';

export default defineComponent({
  components: { QuizQuestion },
  props: {
    quiz: {
      type: Object as () => Quiz,
      required: true,
    },
  },
  data() {
    return {
      answers: [] as string[],
    };
  },
  methods: {
    handleAnswer(answer: string) {
      this.answers.push(answer);
    },
    async submitQuiz() {
      if (this.answers.length !== this.quiz.total_questions) {
        alert('Please answer all questions.');
        return;
      }
      this.$emit('quiz-completed', { answers: this.answers });
    },
  },
});
</script>
