<template>
  <div class="container mx-auto p-4">
    <h1 class="text-3xl font-bold mb-4">Quiz</h1>
    <div v-if="quiz" class="bg-white rounded-lg shadow-md p-6">
      <h2 class="text-2xl font-bold mb-4">{{ quiz.title }}</h2>
      <p class="text-gray-600 mb-6">{{ quiz.description }}</p>
      <div v-for="(question, index) in quiz.questions" :key="index" class="mb-4">
        <h3 class="text-lg font-bold">{{ question.question_text }}</h3>
        <div class="mt-2">
          <label v-for="(option, optionIndex) in question.options" :key="optionIndex" class="block">
            <input type="radio" :name="`question-${index}`" :value="option" v-model="answers[index]">
            {{ option }}
          </label>
        </div>
      </div>
      <button
        @click="submitQuiz"
        class="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-primary hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
      >
        Submit Quiz
      </button>
    </div>
    <div v-else>Loading quiz...</div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { lessonService } from '@/api/services/lessons';

const route = useRoute();
const router = useRouter();
const quizId = route.params.quizId;
const quiz = ref(null);
const answers = ref([]);

onMounted(async () => {
  try {
    const { data } = await lessonService.getQuiz(quizId);
    quiz.value = data;
    answers.value = new Array(data.questions.length).fill('');
  } catch (error) {
    console.error('Error fetching quiz:', error);
  }
});

const submitQuiz = async () => {
  try {
    const formattedAnswers = answers.value.map((answer, index) => ({
      question_id: quiz.value.questions[index].id,
      answer: answer
    }));
    const { data } = await lessonService.submitQuiz(quizId, formattedAnswers);
    console.log(data);
    // Handle the quiz submission result (e.g., show a modal with the score)
    // Then redirect to the lesson or dashboard
    router.push('/dashboard');
  } catch (error) {
    console.error('Error submitting quiz:', error);
  }
};
</script>
