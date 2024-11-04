<template>
  <div class="quizzes">
    <h1>Quizzes</h1>
    <div v-if="quizzes.length">
      <div v-for="quiz in quizzes" :key="quiz.id" class="quiz">
        <h2>{{ quiz.title }}</h2>
        <button @click="startQuiz(quiz.id)" :disabled="!canTakeQuiz(quiz)">
          {{ quizButtonText(quiz) }}
        </button>
      </div>
    </div>
    <div v-else>
      <p>No quizzes available.</p>
    </div>
  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex';

export default {
  name: 'QuizzesComponent',
  computed: {
    ...mapGetters(['quizzes', 'userQuizProgress', 'userProgress']),
  },
  methods: {
    ...mapActions(['fetchQuizzes', 'fetchUserQuizProgress', 'fetchUserProgress']),
    startQuiz(quizId) {
      this.$router.push(`/quizzes/${quizId}`);
    },
    canTakeQuiz(quiz) {
      const relatedLesson = this.userProgress.find(progress => progress.lesson === quiz.lesson);
      return relatedLesson && relatedLesson.completed;
    },
    quizButtonText(quiz) {
      const progress = this.userQuizProgress.find(progress => progress.quiz === quiz.id);
      if (progress) {
        return 'Retake Quiz';
      }
      return this.canTakeQuiz(quiz) ? 'Start Quiz' : 'Locked';
    },
  },
  async created() {
    try {
      await this.fetchQuizzes();
      await this.fetchUserQuizProgress();
      await this.fetchUserProgress();
    } catch (error) {
      console.error('Failed to fetch quizzes:', error);
      alert('Failed to load quizzes. Please try again later.');
    }
  },
};
</script>

<style scoped>
.quizzes {
  padding: 2rem;
}

.quiz {
  margin-bottom: 2rem;
  border: 1px solid #ccc;
  padding: 1rem;
  border-radius: 4px;
}

button {
  background-color: #42b983;
  color: white;
  border: none;
  padding: 0.5rem 1rem;
  cursor: pointer;
}

button:disabled {
  background-color: #ccc;
  cursor: not-allowed;
}

button:hover:not(:disabled) {
  background-color: #35495e;
}
</style>
