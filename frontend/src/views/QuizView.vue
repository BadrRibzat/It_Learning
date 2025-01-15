<template>
  <div class="p-8">
    <h1 class="text-3xl font-bold mb-4">{{ $t('quiz.title') }}</h1>
    <div v-if="loading">{{ $t('common.loading') }}</div>
    <div v-else-if="error">{{ error }}</div>
    <div v-else-if="quizQuestions.length">
      <BaseCard v-for="question in quizQuestions" :key="question.id" class="mb-4">
        <h2 class="text-xl font-bold">{{ question.question_text }}</h2>
        <ul>
          <li v-for="(option, index) in question.options" :key="index" class="mb-2">
            <label>
              <input
                type="radio"
                :name="`question-${question.id}`"
                :value="option"
                v-model="answers[question.id]"
              />
              {{ option }}
            </label>
          </li>
        </ul>
      </BaseCard>
      <BaseButton @click="submitQuiz">{{ $t('quiz.submit') }}</BaseButton>
    </div>
    <p v-else>{{ $t('quiz.noQuestions') }}</p>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import BaseCard from '@/components/base/BaseCard.vue';
import BaseButton from '@/components/base/BaseButton.vue';
import api from '@/api';
import { useStore } from 'vuex';
import { key } from '@/store';
import { QuizQuestion } from '@/types/api';

const route = useRoute();
const router = useRouter();
const store = useStore(key);
const quizQuestions = ref<QuizQuestion[]>([]);
const answers = ref<Record<number, string>>({});
const loading = ref(false);
const error = ref('');

onMounted(async () => {
  const lessonId = route.params.lessonId;
  loading.value = true;
  try {
    const response = await api.get<QuizQuestion[]>(`/quiz-questions/?lesson=${lessonId}`);
    quizQuestions.value = response.data;
  } catch (err) {
    console.error('Error fetching quiz questions:', err);
    error.value = 'Failed to load quiz questions. Please try again.';
  } finally {
    loading.value = false;
  }
});

const submitQuiz = async () => {
  loading.value = true;
  try {
    const response = await api.post(`/quiz-submit/${route.params.lessonId}/`, { answers: answers.value });
    // Handle the quiz submission response
    console.log(response.data);
    
    // Update user progress
    await store.dispatch('progress/updateUserProgress', {
      lessonId: route.params.lessonId,
      completed: true,
      correctAnswers: response.data.correct_answers,
      totalQuestions: response.data.total_questions,
    });

    // Redirect to results page or show results
    router.push({ name: 'quizResults', params: { lessonId: route.params.lessonId } });
  } catch (err) {
    console.error('Error submitting quiz:', err);
    error.value = 'Failed to submit quiz. Please try again.';
  } finally {
    loading.value = false;
  }
};
</script>
