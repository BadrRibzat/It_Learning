<template>
  <div class="quiz-view">
    <h2>Quiz: {{ quiz.lesson_id }}</h2>
    <Question 
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
import { useLessonsStore } from '@/stores/lessons';
import Question from '@/components/lessons/quiz/Question.vue';

export default defineComponent({
  components: { Question },
  props: ['lessonId'],
  setup() {
    const lessonsStore = useLessonsStore();
    return { lessonsStore };
  },
  data() {
    return {
      quiz: null as any,
      answers: [] as string[],
    };
  },
  async mounted() {
    this.quiz = await this.lessonsStore.getQuiz(this.lessonId);
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
      const response = await this.lessonsStore.submitQuiz(this.quiz.lesson_id, { answers: this.answers });
      if (response.next_lesson_unlocked) {
        this.$router.push('/next-lesson');
      }
    },
  },
});
</script>
