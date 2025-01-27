<template>
  <div class="bg-white rounded-lg shadow-lg p-6">
    <!-- Header -->
    <div class="flex justify-between items-center mb-6">
      <div>
        <h2 class="text-2xl font-bold text-gray-900">Level Advancement Test</h2>
        <p class="text-gray-600 mt-1">
          Pass this test to advance to the {{ nextLevel }} level
        </p>
      </div>
      
      <router-link
        :to="`/profile/lessons/${currentLevel}`"
        class="text-primary hover:text-primary-dark"
      >
        <i class="fas fa-arrow-left mr-2"></i>
        Back to Lessons
      </router-link>
    </div>

    <!-- Prerequisites Check -->
    <div v-if="!canTakeTest" class="mb-6">
      <div class="bg-yellow-50 border-l-4 border-yellow-400 p-4">
        <div class="flex">
          <div class="flex-shrink-0">
            <i class="fas fa-exclamation-triangle text-yellow-400"></i>
          </div>
          <div class="ml-3">
            <h3 class="text-lg font-medium text-yellow-800">
              Prerequisites Not Met
            </h3>
            <div class="mt-2 text-yellow-700">
              <p>Before taking this test, you need to:</p>
              <ul class="list-disc list-inside mt-2">
                <li>Complete all lessons in the current level</li>
                <li>Pass all lesson quizzes</li>
                <li>Achieve minimum 80% success rate in current level</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Test Start Screen -->
    <div v-else-if="!testStarted && !testCompleted" class="text-center py-8">
      <div class="mb-8 max-w-2xl mx-auto">
        <div class="bg-gray-50 rounded-lg p-6">
          <h3 class="text-lg font-semibold mb-4">Test Information</h3>
          <div class="grid grid-cols-2 gap-6">
            <div class="text-left">
              <ul class="space-y-3">
                <li class="flex items-center">
                  <i class="fas fa-tasks text-primary mr-2"></i>
                  <span>10 questions</span>
                </li>
                <li class="flex items-center">
                  <i class="fas fa-clock text-primary mr-2"></i>
                  <span>45 minutes time limit</span>
                </li>
              </ul>
            </div>
            <div class="text-left">
              <ul class="space-y-3">
                <li class="flex items-center">
                  <i class="fas fa-star text-primary mr-2"></i>
                  <span>80% required to pass</span>
                </li>
                <li class="flex items-center">
                  <i class="fas fa-redo text-primary mr-2"></i>
                  <span>24-hour cooldown if failed</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      <button
        @click="startTest"
        class="px-6 py-3 bg-primary text-white rounded-md hover:bg-primary-dark transition-colors"
      >
        Start Test
      </button>
    </div>

    <!-- Test Questions -->
    <div v-if="testStarted && !testCompleted" class="space-y-6">
      <!-- Timer -->
      <div class="fixed top-4 right-4 bg-white p-4 rounded-lg shadow-md">
        <div 
          class="text-lg font-semibold"
          :class="{ 'text-red-500': timeRemaining < 300 }"
        >
          Time Remaining: {{ formatTime(timeRemaining) }}
        </div>
      </div>

      <!-- Progress Bar -->
      <div class="mb-6">
        <div class="flex justify-between text-sm text-gray-600 mb-1">
          <span>Question {{ currentIndex + 1 }} of {{ questions.length }}</span>
          <span>{{ Math.round(((currentIndex + 1) / questions.length) * 100) }}% Complete</span>
        </div>
        <div class="w-full bg-gray-200 rounded-full h-2">
          <div
            class="bg-primary h-2 rounded-full transition-all duration-300"
            :style="{ width: `${((currentIndex + 1) / questions.length) * 100}%` }"
          ></div>
        </div>
      </div>

      <!-- Current Question -->
      <div v-if="currentQuestion" class="bg-gray-50 rounded-lg p-6">
        <h3 class="text-lg font-semibold mb-4">{{ currentQuestion.question }}</h3>
        
        <div class="space-y-3">
          <button
            v-for="option in currentQuestion.options"
            :key="option"
            @click="selectAnswer(option)"
            :class="[
              'w-full text-left p-4 rounded-lg transition-colors',
              {
                'bg-primary text-white': selectedAnswer === option,
                'bg-white hover:bg-gray-100': selectedAnswer !== option
              }
            ]"
          >
            {{ option }}
          </button>
        </div>
      </div>

      <!-- Navigation -->
      <div class="flex justify-between mt-6">
        <button
          @click="previousQuestion"
          :disabled="currentIndex === 0"
          class="px-4 py-2 text-gray-600 hover:text-gray-800 disabled:opacity-50"
        >
          Previous
        </button>
        
        <button
          @click="nextQuestion"
          :disabled="!selectedAnswer"
          class="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary-dark disabled:opacity-50"
        >
          {{ isLastQuestion ? 'Submit Test' : 'Next Question' }}
        </button>
      </div>
    </div>

    <!-- Test Results -->
    <div v-if="testCompleted" class="text-center py-8">
      <div class="mb-8">
        <div 
          class="text-6xl font-bold mb-2"
          :class="isPassing ? 'text-green-500' : 'text-red-500'"
        >
          {{ score }}%
        </div>
        <p class="text-xl" :class="isPassing ? 'text-green-600' : 'text-red-600'">
          {{ getResultMessage() }}
        </p>
      </div>

      <div class="max-w-md mx-auto bg-gray-50 rounded-lg p-6 mb-8">
        <h3 class="text-lg font-semibold mb-4">Test Summary</h3>
        <div class="grid grid-cols-2 gap-4">
          <div>
            <div class="text-2xl font-bold text-green-500">{{ correctAnswers }}</div>
            <div class="text-sm text-gray-600">Correct</div>
          </div>
          <div>
            <div class="text-2xl font-bold text-red-500">
              {{ questions.length - correctAnswers }}
            </div>
            <div class="text-sm text-gray-600">Incorrect</div>
          </div>
        </div>
      </div>

      <div class="space-x-4">
        <router-link
          :to="`/profile/lessons/${isPassing ? nextLevel : currentLevel}`"
          class="inline-block px-6 py-3 bg-primary text-white rounded-md hover:bg-primary-dark transition-colors"
        >
          {{ isPassing ? `Start ${nextLevel} Level` : 'Return to Current Level' }}
        </router-link>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, computed, onMounted, onUnmounted } from 'vue';
import { useStore } from 'vuex';
import { useRoute, useRouter } from 'vue-router';
import { NotificationService } from '@/utils/NotificationService';

export default {
  name: 'LevelTestComponent',
  
  setup() {
    const store = useStore();
    const route = useRoute();
    const router = useRouter();

    const currentLevel = computed(() => route.params.level);
    const nextLevel = computed(() => {
      const levels = ['beginner', 'intermediate', 'advanced', 'expert'];
      const currentIndex = levels.indexOf(currentLevel.value);
      return levels[currentIndex + 1] || currentLevel.value;
    });

    // Test state
    const canTakeTest = ref(true);
    const testStarted = ref(false);
    const testCompleted = ref(false);
    const questions = ref([]);
    const currentIndex = ref(0);
    const selectedAnswer = ref('');
    const userAnswers = ref([]);
    const timeRemaining = ref(45 * 60); // 45 minutes in seconds
    let timer = null;

    // Computed properties
    const currentQuestion = computed(() => questions.value[currentIndex.value]);
    const isLastQuestion = computed(() => currentIndex.value === questions.value.length - 1);
    const score = computed(() => {
      if (!testCompleted.value) return 0;
      return Math.round((correctAnswers.value / questions.value.length) * 100);
    });
    const correctAnswers = computed(() => {
      return userAnswers.value.filter((answer, index) => 
        answer === questions.value[index].answer
      ).length;
    });
    const isPassing = computed(() => score.value >= 80);

    // Methods
    const formatTime = (seconds) => {
      const minutes = Math.floor(seconds / 60);
      const remainingSeconds = seconds % 60;
      return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
    };

    const startTimer = () => {
      timer = setInterval(() => {
        if (timeRemaining.value > 0) {
          timeRemaining.value--;
        } else {
          submitTest(true);
        }
      }, 1000);
    };

    const checkEligibility = async () => {
      try {
        const response = await store.dispatch('lessons/checkLevelTestEligibility', {
          level: currentLevel.value
        });
        canTakeTest.value = response.eligible;
      } catch (error) {
        NotificationService.showError('Failed to check test eligibility');
        canTakeTest.value = false;
      }
    };

    const startTest = async () => {
      try {
        const response = await store.dispatch('lessons/getLevelTest', {
          level: currentLevel.value
        });
        questions.value = response;
        testStarted.value = true;
        startTimer();
      } catch (error) {
        NotificationService.showError('Failed to start test');
      }
    };

    const selectAnswer = (answer) => {
      selectedAnswer.value = answer;
    };

    const nextQuestion = async () => {
      userAnswers.value[currentIndex.value] = selectedAnswer.value;
      
      if (isLastQuestion.value) {
        await submitTest();
      } else {
        currentIndex.value++;
        selectedAnswer.value = userAnswers.value[currentIndex.value] || '';
      }
    };

    const previousQuestion = () => {
      if (currentIndex.value > 0) {
        userAnswers.value[currentIndex.value] = selectedAnswer.value;
        currentIndex.value--;
        selectedAnswer.value = userAnswers.value[currentIndex.value] || '';
      }
    };

    const submitTest = async (timeout = false) => {
      clearInterval(timer);
      
      try {
        if (timeout) {
          NotificationService.showWarning("Time's up! Your test has been submitted.");
        }

        const response = await store.dispatch('lessons/submitLevelTest', {
          level: currentLevel.value,
          answers: userAnswers.value
        });

        testCompleted.value = true;

        if (response.passed) {
          NotificationService.showSuccess('Congratulations! You\'ve advanced to the next level!');
        } else {
          NotificationService.showInfo('Keep practicing and try again in 24 hours.');
        }
      } catch (error) {
        NotificationService.showError('Failed to submit test');
      }
    };

    const getResultMessage = () => {
      if (isPassing.value) {
        return `Congratulations! You've advanced to the ${nextLevel.value} level!`;
      }
      return 'Keep practicing and try again in 24 hours.';
    };

    // Lifecycle hooks
    onMounted(() => {
      checkEligibility();
    });

    onUnmounted(() => {
      if (timer) {
        clearInterval(timer);
      }
    });

    return {
      currentLevel,
      nextLevel,
      canTakeTest,
      testStarted,
      testCompleted,
      questions,
      currentIndex,
      currentQuestion,
      selectedAnswer,
      timeRemaining,
      isLastQuestion,
      score,
      correctAnswers,
      isPassing,
      formatTime,
      startTest,
      selectAnswer,
      nextQuestion,
      previousQuestion,
      getResultMessage
    };
  }
};
</script>
