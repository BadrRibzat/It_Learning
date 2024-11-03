<template>
  <div class="quiz-list">
    <h2>Quizzes</h2>
    <ul>
      <li v-for="quiz in quizzes" :key="quiz.id">
        <Quiz :quiz="quiz" @submit="handleQuizSubmit" />
      </li>
    </ul>
  </div>
</template>

<script>
import Quiz from './Quiz.vue';

export default {
  components: {
    Quiz,
  },
  props: {
    quizzes: {
      type: Array,
      required: true,
    },
  },
  methods: {
    handleQuizSubmit(quizId, answers) {
      this.$emit('submit', quizId, answers);
    },
  },
};
</script>

<style scoped>
.quiz-list {
  padding: 20px;
}

ul {
  list-style: none;
  padding: 0;
}

li {
  margin-bottom: 20px;
}
</style>
