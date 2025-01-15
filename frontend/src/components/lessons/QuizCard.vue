<template>
  <div class="bg-white rounded-lg shadow-md p-4">
    <div class="text-center">
      <h3 class="text-xl font-bold mb-2">{{ quiz.title }}</h3>
      <p class="text-gray-600">{{ quiz.description }}</p>
      <button
        @click="startQuiz"
        class="mt-4 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-primary hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
      >
        Start Quiz
      </button>
    </div>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router';

const router = useRouter();

defineProps({
  quiz: {
    type: Object,
    required: true,
  },
});

const startQuiz = () => {
  router.push(`/quiz/${quiz.id}`);
};
</script>
