<template>
  <div class="p-8">
    <h1 class="text-3xl font-bold mb-4">{{ $t('levelTest.title') }}</h1>
    <div v-if="questions.length">
      <div v-for="question in questions" :key="question.id" class="mb-4">
        <h2 class="text-xl font-bold">{{ question.question_text }}</h2>
        <div v-for="option in question.options" :key="option" class="mt-2">
          <label>
            <input type="radio" :name="`question-${question.id}`" :value="option" v-model="answers[question.id]">
            {{ option }}
          </label>
        </div>
      </div>
      <BaseButton @click="submitTest" class="mt-4">{{ $t('levelTest.submit') }}</BaseButton>
    </div>
    <p v-else>{{ $t('levelTest.noQuestions') }}</p>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useStore } from 'vuex';
import { key } from '@/store';
import BaseButton from '@/components/base/BaseButton.vue';
import api from '@/api';

const route = useRoute();
const router = useRouter();
const store = useStore(key);

const questions = ref<any[]>([]);
const answers = ref<Record<number, string>>({});

onMounted(async () => {
  const levelId = route.params.levelId;
  try {
    const response = await api.get(`/level-tests/${levelId}/`);
    questions.value = response.data.questions;
  } catch (error) {
    console.error('Error fetching level test questions:', error);
  }
});

const submitTest = async () => {
  try {
    const response = await api.post(`/level-test-submit/${route.params.levelId}/`, { answers: answers.value });
    // Handle the response, e.g., show results or redirect
    console.log(response.data);
    router.push('/levels'); // Redirect to levels page after test submission
  } catch (error) {
    console.error('Error submitting level test:', error);
  }
};
</script>
