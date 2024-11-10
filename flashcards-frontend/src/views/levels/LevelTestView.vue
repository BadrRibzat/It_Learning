<template>
    <div class="min-h-screen bg-gray-100">
        <Sidebar />
        <div class="ml-64 p-8">
            <div class="max-w-3xl mx-auto">
                <!-- Test Header -->
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

                <!-- Test Content -->
                <div v-if="currentQuestion" class="bg-white p-6 rounded-lg shadow-lg mb-6">
                    <!-- Question -->
                    <div class="mb-8">
                        <h2 class="text-xl font-semibold mb-4">{{ currentQuestion.question_text }}</h2>

                        <!-- Answer Input -->
                        <div class="space-y-4">
                            <input
                                v-model="userAnswer"
                                type="text"
                                class="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:border-primary focus:ring-primary"
                                placeholder="Type your answer here"
                            />
                        </div>
                    </div>

                    <!-- Navigation Buttons -->
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

                <!-- Loading State -->
                <div v-else-if="isLoading" class="bg-white p-6 rounded-lg shadow-lg">
                    <div class="flex justify-center items-center">
                        <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
                    </div>
                </div>

                <!-- Test Results Modal -->
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
import { ref, computed, onMounted } from 'vue';
import { useStore } from 'vuex';
import { useRoute, useRouter } from 'vue-router';
import Sidebar from '@/components/dashboard/Sidebar.vue';

const store = useStore();
const route = useRoute();
const router = useRouter();

const isLoading = ref(true);
const error = ref(null);
const showResults = ref(false);
const userAnswer = ref('');
const score = ref(0);
const passed = ref(false);

// Safe computed properties with null checks
const currentLevel = computed(() => store.state.levels?.currentLevel || null);
const levelTestQuestions = computed(() => store.state.levels?.levelTestQuestions || []);
const currentQuestionIndex = computed(() => store.state.levels?.testProgress?.currentQuestion || 0);
const currentQuestion = computed(() => levelTestQuestions.value[currentQuestionIndex.value] || null);

const currentQuestionNumber = computed(() => {
    if (!currentQuestion.value) return 0;
    return currentQuestionIndex.value + 1;
});

const totalQuestions = computed(() => levelTestQuestions.value.length);

const progressPercentage = computed(() => {
    if (!totalQuestions.value) return 0;
    return (currentQuestionIndex.value / totalQuestions.value) * 100;
});

const isFirstQuestion = computed(() => currentQuestionIndex.value === 0);
const isLastQuestion = computed(() => {
    if (!totalQuestions.value) return true;
    return currentQuestionIndex.value === totalQuestions.value - 1;
});

const isTestComplete = computed(() => {
    const answers = store.state.levels?.testProgress?.answers || {};
    return Object.keys(answers).length === totalQuestions.value;
});

const scoreColor = computed(() => {
    return passed.value ? 'text-green-500' : 'text-red-500';
});

const scoreMessage = computed(() => {
    return passed.value
        ? 'Congratulations! You passed the test!'
        : 'You need to score at least 80% to pass. Try again!';
});

// Methods
const nextQuestion = () => {
    if (userAnswer.value) {
        store.dispatch('levels/setTestAnswer', {
            questionId: currentQuestion.value.id,
            answer: userAnswer.value
        });
        store.dispatch('levels/nextQuestion');
        userAnswer.value = '';
    }
};

const previousQuestion = () => {
    store.dispatch('levels/previousQuestion');
    userAnswer.value = store.state.levels.testProgress.answers[currentQuestion.value.id] || '';
};

const submitTest = async () => {
    try {
        const result = await store.dispatch('levels/submitLevelTest', {
            levelId: currentLevel.value.id,
            answers: store.state.levels.testProgress.answers
        });

        score.value = result.score;
        passed.value = result.passed;
        showResults.value = true;
    } catch (error) {
        console.error('Error submitting test:', error);
        // Handle error (show error message)
    }
};

const handleTestCompletion = async () => {
  if (passed.value) {
    // Update user level progress
    await store.dispatch('levels/updateLevelProgress', {
      levelId: currentLevel.value.id,
      completed: true,
      score: score.value
    });

    router.push({
      name: 'Lessons',
      query: { level: currentLevel.value.id }
    });
  } else {
    // Reset test for retry
    store.dispatch('levels/resetTest');
    showResults.value = false;
    userAnswer.value = '';
  }
};

onMounted(async () => {
    try {
        const levelId = route.params.id;
        if (!levelId) {
            throw new Error('No level ID provided');
        }

        await Promise.all([
            store.dispatch('levels/fetchLevel', levelId),
            store.dispatch('levels/fetchLevelTestQuestions', levelId)
        ]);

        if (currentLevel.value && currentLevel.value.level_order === 1) {
            router.push({ name: 'Lessons', query: { level: currentLevel.value.id } });
        }
    } catch (error) {
        console.error('Error loading level test:', error);
        error.value = 'Failed to load level test. Please try again.';
    } finally {
        isLoading.value = false;
    }
});
</script>
