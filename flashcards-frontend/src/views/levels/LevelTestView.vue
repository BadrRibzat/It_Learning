<template>
    <div class="min-h-screen bg-gray-100">
        <Sidebar />
        <div class="ml-64 p-8">
            <div class="max-w-3xl mx-auto">
                <div class="bg-white p-6 rounded-lg shadow-lg mb-6">
                    <h1 class="text-3xl font-bold mb-4">Level Test: {{ currentLevel?.name }}</h1>
                    <div class="flex justify-between items-center">
                        <p class="text-gray-600">
                            Question {{ currentQuestionNumber }} of {{ totalQuestions }}
                        </p>
                        <div class="flex items-center space-x-2">
                            <span class="text-sm text-gray-500">Progress:</span>
                            <div class="w-32 h-2 bg-gray-200 rounded-full">
                                <div
                                    class="h-full bg-primary rounded-full"
                                    :style="{ width: `${progressPercentage}%` }"
                                ></div>
                            </div>
                        </div>
                    </div>
                </div>

                <div v-if="currentQuestion" class="bg-white p-6 rounded-lg shadow-lg mb-6">
                    <div class="mb-8">
                        <h2 class="text-xl font-semibold mb-4">{{ currentQuestion.question_text }}</h2>
                        <div class="space-y-4">
                            <input
                                v-model="userAnswer"
                                type="text"
                                class="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:border-primary focus:ring-primary"
                                placeholder="Type your answer here"
                            />
                        </div>
                    </div>
                    <div class="flex justify-between mt-8">
                        <button
                            @click="previousQuestion"
                            :disabled="isFirstQuestion"
                            class="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 disabled:opacity-50"
                        >
                            Previous
                        </button>
                        <button
                            v-if="!isLastQuestion"
                            @click="nextQuestion"
                            :disabled="!userAnswer"
                            class="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark disabled:opacity-50"
                        >
                            Next
                        </button>
                        <button
                            v-else
                            @click="submitTest"
                            :disabled="!isTestComplete"
                            class="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 disabled:opacity-50"
                        >
                            Submit Test
                        </button>
                    </div>
                </div>

                <div v-else-if="isLoading" class="bg-white p-6 rounded-lg shadow-lg">
                    <div class="flex justify-center items-center">
                        <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
                    </div>
                </div>

                <div
                    v-if="showResults"
                    class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
                >
                    <div class="bg-white p-8 rounded-lg shadow-xl max-w-md w-full">
                        <h2 class="text-2xl font-bold mb-4">Test Results</h2>
                        <div class="mb-6">
                            <div class="text-center">
                                <div class="text-6xl font-bold mb-2" :class="scoreColor">
                                    {{ score }}%
                                </div>
                                <p class="text-xl" :class="scoreColor">
                                    {{ scoreMessage }}
                                </p>
                            </div>
                        </div>
                        <div class="flex justify-center">
                            <button
                                @click="handleTestCompletion"
                                class="px-6 py-3 bg-primary text-white rounded-lg hover:bg-primary-dark"
                            >
                                {{ passed ? 'Continue to Next Level' : 'Try Again' }}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue';
import { useRouter } from 'vue-router';
import { useStore } from 'vuex';
import Sidebar from '@/components/dashboard/Sidebar.vue';
import LessonCard from '@/components/lessons/LessonCard.vue';

const route = useRouter();
const store = useStore();
const loading = ref(false);
const error = ref(null);
const selectedLevel = ref(route.query.level || '');
const lessons = ref([]);
const levels = ref([]);

const fetchLessonsForLevel = async () => {
  try {
    loading.value = true;
    error.value = null;
    
    if (!levels.value.length) {
      error.value = 'Levels are not loaded yet. Please try again.';
      return;
    }

    const level = levels.value.find(l => l.id === parseInt(selectedLevel.value));
    if (!level) {
      error.value = 'Selected level not found. Please select a valid level.';
      return;
    }

    if (level.level_order === 1) {
      const response = await store.dispatch('lessons/fetchLessons', selectedLevel.value);
      lessons.value = response.data || [];
    } else {
      const levelProgress = await store.dispatch('progress/getUserLevelProgress');
      const hasPassedTest = levelProgress.some(p => 
        p.level === parseInt(selectedLevel.value) && p.completed
      );
      
      if (hasPassedTest) {
        const response = await store.dispatch('lessons/fetchLessons', selectedLevel.value);
        lessons.value = response.data || [];
      } else {
        route.push(`/dashboard/levels/${selectedLevel.value}/test`);
      }
    }
  } catch (err) {
    error.value = 'Failed to fetch lessons. Please try again.';
  } finally {
    loading.value = false;
  }
};

const filteredLessons = computed(() => {
  if (selectedLevel.value) {
    return lessons.value.filter(lesson => lesson.level === parseInt(selectedLevel.value));
  }
  return lessons.value;
});

onMounted(async () => {
  try {
    loading.value = true;
    await store.dispatch('levels/fetchLevels');
    levels.value = store.state.levels.levels || [];

    if (route.query.level) {
      selectedLevel.value = route.query.level;
    }

    await fetchLessonsForLevel();
  } catch (err) {
    error.value = 'Failed to initialize lessons view. Please try again.';
  } finally {
    loading.value = false;
  }
});
</script>
