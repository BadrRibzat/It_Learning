<template>
  <div class="min-h-screen bg-gray-100">
    <Sidebar />
    <div class="ml-64 p-8">
      <h1 class="text-3xl font-bold mb-8">Quiz Detail</h1>
      <div class="bg-white p-8 rounded-lg shadow-lg">
        <h2 class="text-2xl font-bold mb-4">{{ quiz.title }}</h2>
        <div v-for="(question, index) in quiz.questions" :key="question.id" class="mb-8">
          <h3 class="text-xl font-bold mb-4">Question {{ index + 1 }}</h3>
          <p class="mb-4">{{ question.question_text }}</p>
          <div class="flex flex-col">
            <label v-for="option in question.options" :key="option" class="mb-2">
              <input type="radio" :value="option" v-model="answers[question.id]" />
              {{ option }}
            </label>
          </div>
        </div>
        <button @click="submitQuiz" class="bg-primary text-white px-4 py-2 rounded-lg">Submit Quiz</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useStore } from 'vuex';
import { useRoute } from 'vue-router';
import Sidebar from '@/components/dashboard/Sidebar.vue';

const store = useStore();
const route = useRoute();
const quiz = ref({});
const answers = ref({});

onMounted(async () => {
  const quizId = route.params.id;
  await store.dispatch('quizzes/fetchQuiz', quizId);
  quiz.value = store.state.quizzes.currentQuiz;
});

const submitQuiz = async () => {
  try {
    const response = await store.dispatch('quizzes/submitQuiz', { 
      id: quiz.value.id, 
      answers: Object.entries(answers.value).map(([questionId, answer]) => ({
        question_id: parseInt(questionId),
        answer
      }))
    });

    // Real-time feedback and progress tracking
    const { score, total_questions, percentage } = response;
    
    // Update user progress
    await store.dispatch('progress/updateQuizProgress', {
      quizId: quiz.value.id,
      score,
      totalQuestions: total_questions
    });

    // Show result modal or redirect
    if (percentage >= 80) {
      // Unlock next lesson or level
      await store.dispatch('lessons/unlockNextLesson', lesson.value.id);
      
      // Show success message
      alert('Congratulations! You passed the quiz and unlocked the next lesson.');
      router.push('/dashboard/lessons');
    } else {
      // Show improvement message
      alert(`You scored ${percentage}%. Try again to unlock the next lesson.`);
    }
  } catch (error) {
    console.error('Error submitting quiz:', error);
  }
};
</script>
