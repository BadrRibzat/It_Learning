<template>
  <div class="min-h-screen bg-gray-100">
    <Sidebar />
    <div class="ml-64 p-8">
      <h1 class="text-3xl font-bold mb-8">Level Test</h1>
      <div class="bg-white p-8 rounded-lg shadow-lg">
        <h2 class="text-2xl font-bold mb-4">Test for Level {{ level.name }}</h2>
        <div v-for="(question, index) in levelTestQuestions" :key="question.id" class="mb-8">
          <h3 class="text-xl font-bold mb-4">Question {{ index + 1 }}</h3>
          <p class="mb-4">{{ question.question_text }}</p>
          <div class="flex flex-col">
            <label v-for="option in question.options" :key="option" class="mb-2">
              <input type="radio" :value="option" v-model="answers[question.id]" />
              {{ option }}
            </label>
          </div>
        </div>
        <button @click="submitTest" class="bg-primary text-white px-4 py-2 rounded-lg">Submit Test</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useStore } from 'vuex';
import { useRoute, useRouter } from 'vue-router';
import Sidebar from '@/components/dashboard/Sidebar.vue';

const store = useStore();
const route = useRoute();
const router = useRouter();
const level = ref({});
const levelTestQuestions = ref([]);
const answers = ref({});

onMounted(async () => {
  try {
    const levelId = route.params.id;
    await store.dispatch('levels/fetchLevel', levelId);
    level.value = store.state.levels.currentLevel;
    
    // Fetch test questions for this level
    const response = await store.dispatch('levels/fetchLevelTestQuestions', levelId);
    levelTestQuestions.value = response.data;
  } catch (error) {
    console.error('Failed to load level test:', error);
  }
});

const submitTest = async () => {
  try {
    const score = calculateScore();
    const response = await store.dispatch('levels/submitLevelTest', {
      id: level.value.id,
      score,
    });

    // Handle the response
    if (response.data.passed) {
      // Show success message and redirect
      router.push('/dashboard/levels');
    } else {
      // Show failure message
    }
  } catch (error) {
    console.error('Failed to submit test:', error);
  }
};

const calculateScore = () => {
  let correctAnswers = 0;
  levelTestQuestions.value.forEach((question) => {
    if (answers.value[question.id] === question.correct_answer) {
      correctAnswers++;
    }
  });
  return (correctAnswers / levelTestQuestions.value.length) * 100;
};
</script>
