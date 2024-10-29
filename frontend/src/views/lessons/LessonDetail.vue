<template>
  <div class="container mx-auto p-4">
    <h1 class="text-3xl font-bold mb-4">{{ lesson.title }}</h1>
    <p class="text-gray-600 mb-6">{{ lesson.description }}</p>

    <div v-if="!showingFlashcards" class="mb-6">
      <h2 class="text-2xl font-bold mb-4">Lesson Content</h2>
      <div v-html="lesson.content"></div>
      <button
        @click="showingFlashcards = true"
        class="mt-4 px-4 py-2 bg-primary text-white rounded hover:bg-primary-dark"
      >
        Start Flashcards
      </button>
    </div>

    <div v-if="showingFlashcards">
      <FlashcardList
        :flashcards="flashcards"
        @complete="showingFlashcards = false"
      />
    </div>

    <div v-if="!showingFlashcards">
      <h2 class="text-2xl font-bold mb-4">Quizzes</h2>
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <QuizCard v-for="quiz in quizzes" :key="quiz.id" :quiz="quiz" />
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import { lessonService } from '@/api/services/lessons';
import FlashcardList from '@/components/lessons/FlashcardList.vue';
import QuizCard from '@/components/lessons/QuizCard.vue';

const route = useRoute();
const lessonId = route.params.lessonId;
const lesson = ref({});
const flashcards = ref([]);
const quizzes = ref([]);
const showingFlashcards = ref(false);

onMounted(async () => {
  try {
    const { data } = await lessonService.getLesson(lessonId);
    lesson.value = data;
    const { data: flashcardData } = await lessonService.getFlashcards(lessonId);
    flashcards.value = flashcardData;
    const { data: quizData } = await lessonService.getQuizzes(lessonId);
    quizzes.value = quizData;
  } catch (error) {
    console.error('Error fetching lesson data:', error);
  }
});
</script>
