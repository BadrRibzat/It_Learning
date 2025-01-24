<template>
  <div class="page-container p-10">
    <h1 class="text-4xl font-bold text-center text-primary mb-8">
      Quizzes
    </h1>
    <div v-if="currentLessonId">
      <QuizForm :lessonId="currentLessonId" :lessonTitle="currentLessonTitle" />
    </div>
    <div v-else class="text-center text-gray-600">
      <p>Please select a lesson to take the quiz.</p>
      <!-- In a real application, you would likely have a list of lessons here -->
    </div>
  </div>
</template>

<script>
import QuizForm from "@/components/quizzes/QuizForm.vue";
import { ref } from 'vue';

export default {
  name: "QuizzesView",
  components: {
    QuizForm,
  },
  setup() {
    // Mock the current lesson ID and title for demonstration
    // In a real application, this would be determined by user navigation or selection
    const currentLessonId = ref(1);
    const currentLessonTitle = ref("Beginner Lesson 1");

    return {
      currentLessonId,
      currentLessonTitle,
    };
  },
};
</script>
