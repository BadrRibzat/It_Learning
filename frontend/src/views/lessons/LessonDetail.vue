<template>
  <div class="lesson-detail-view">
    <h1>{{ lesson.title }}</h1>
    <p>{{ lesson.content }}</p>
    <FlashcardList :flashcards="flashcards" @submit="handleFlashcardSubmit" />
    <QuizList :quizzes="quizzes" @submit="handleQuizSubmit" />
  </div>
</template>

<script>
import FlashcardList from '../../components/lessons/FlashcardList.vue';
import QuizList from '../../components/lessons/QuizList.vue';
import { mapActions, mapGetters } from 'vuex';

export default {
  components: {
    FlashcardList,
    QuizList,
  },
  data() {
    return {
      lesson: {},
      flashcards: [],
      quizzes: [],
    };
  },
  computed: {
    ...mapGetters('lessons', ['lessons']),
  },
  methods: {
    ...mapActions('lessons', ['fetchLesson', 'fetchFlashcards', 'fetchQuizzes', 'submitFlashcard', 'submitQuiz']),
    async handleFlashcardSubmit(flashcardId, answer) {
      try {
        await this.submitFlashcard({ flashcardId, answer });
        this.fetchFlashcards(this.$route.params.id);
      } catch (error) {
        console.error('Flashcard submission failed:', error);
      }
    },
    async handleQuizSubmit(quizId, answers) {
      try {
        await this.submitQuiz({ quizId, answers });
        this.fetchQuizzes(this.$route.params.id);
      } catch (error) {
        console.error('Quiz submission failed:', error);
      }
    },
  },
  async created() {
    const lessonId = this.$route.params.id;
    this.lesson = await this.fetchLesson(lessonId);
    this.flashcards = await this.fetchFlashcards(lessonId);
    this.quizzes = await this.fetchQuizzes(lessonId);
  },
};
</script>

<style scoped>
.lesson-detail-view {
  padding: 20px;
}
</style>
