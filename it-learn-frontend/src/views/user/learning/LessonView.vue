<template>
  <div class="lesson-view">
    <h2>{{ currentLesson.title }}</h2>
    <p>{{ currentLesson.description }}</p>
    <FlashcardsView 
      v-if="currentLesson && !currentLesson.progress.quiz_unlocked"
      :lessonId="currentLesson.id"
      @quiz-unlocked="onQuizUnlocked"
    />
    <QuizView 
      v-if="currentLesson && currentLesson.progress.quiz_unlocked"
      :lessonId="currentLesson.id"
      @quiz-completed="onQuizCompleted"
    />
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { useLessonsStore } from '@/stores/lessons';
import FlashcardsView from '@/components/lessons/flashcards/FlashcardsView.vue';
import QuizView from '@/components/lessons/quiz/QuizView.vue';

export default defineComponent({
  components: { FlashcardsView, QuizView },
  props: ['lessonId'],
  setup() {
    const lessonsStore = useLessonsStore();
    return { lessonsStore };
  },
  data() {
    return {
      currentLesson: null as any,
    };
  },
  async mounted() {
    this.currentLesson = await this.lessonsStore.getLesson(this.lessonId);
  },
  methods: {
    async onQuizUnlocked(response: any) {
      if (response.redirect_to_quiz) {
        this.currentLesson.progress.quiz_unlocked = true;
      }
    },
    async onQuizCompleted(response: any) {
      if (response.next_lesson_unlocked) {
        this.$router.push('/next-lesson');
      }
    },
  },
});
</script>
