<template>
  <div class="quizzes">
    <h1>Quizzes</h1>
    <div v-if="quizzes.length">
      <div v-for="quiz in quizzes" :key="quiz.id" class="quiz">
        <h2>{{ quiz.title }}</h2>
        <button @click="startQuiz(quiz.id)">Start Quiz</button>
      </div>
    </div>
    <div v-else>
      <p>Loading quizzes...</p>
    </div>
  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex';

export default {
  name: 'QuizzesComponent',
  computed: {
    ...mapGetters(['quizzes']),
  },
  methods: {
    ...mapActions(['fetchQuizzes']),
    startQuiz(quizId) {
      // Logic to start quiz
      console.log(`Start quiz ${quizId}`);
    },
  },
  async created() {
    await this.fetchQuizzes();
  },
};
</script>

<style scoped>
.quizzes {
  padding: 2rem;
}

.quiz {
  margin-bottom: 2rem;
}

button {
  background-color: #42b983;
  color: white;
  border: none;
  padding: 0.5rem 1rem;
  margin-top: 1rem;
  cursor: pointer;
}

button:hover {
  background-color: #35495e;
}
</style>
