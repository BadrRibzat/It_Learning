<template>
  <div class="bg-white rounded-lg shadow-lg p-6">
    <div class="mb-6">
      <h2 class="text-2xl font-bold text-gray-900">Level Advancement Test</h2>
      <p class="text-gray-600" v-if="!testStarted">
        Complete this test to advance to {{ currentLevel }} level
      </p>
    </div>

    <!-- Prerequisites Check -->
    <div v-if="!canTakeTest" class="mb-6 p-4 bg-yellow-50 border border-yellow-200 rounded-md">
      <h3 class="text-lg font-semibold text-yellow-800 mb-2">
        <i class="fas fa-exclamation-triangle mr-2"></i>
        Prerequisites Not Met
      </h3>
      <p class="text-yellow-700">
        Before taking this test, you need to:
      </p>
      <ul class="mt-2 space-y-1 text-yellow-700">
        <li><i class="fas fa-check-circle mr-2"></i>Complete all flashcards in current level</li>
        <li><i class="fas fa-check-circle mr-2"></i>Pass all quizzes in current level</li>
        <li><i class="fas fa-check-circle mr-2"></i>Achieve minimum 80% success rate</li>
      </ul>
    </div>

    <!-- Test Start Screen -->
    <div v-else-if="!testStarted && !testCompleted" class="text-center">
      <div class="mb-6 p-4 bg-gray-50 rounded-lg">
        <h3 class="text-lg font-semibold mb-2">Test Requirements</h3>
        <ul class="text-left text-gray-600 space-y-2">
          <li><i class="fas fa-check-circle text-green-500 mr-2"></i>10 questions to complete</li>
          <li><i class="fas fa-clock text-blue-500 mr-2"></i>45 minutes time limit</li>
          <li><i class="fas fa-star text-yellow-500 mr-2"></i>Required score: 80%</li>
          <li><i class="fas fa-redo text-purple-500 mr-2"></i>No retakes for 24 hours if failed</li>
        </ul>
      </div>
      <button
        @click="startTest"
        class="px-6 py-3 bg-primary text-white rounded-md hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
      >
        Start Test
      </button>
    </div>

    <!-- Test Questions -->
    <div v-if="testStarted && !testCompleted" class="space-y-6">
      <!-- Timer -->
      <div class="fixed top-4 right-4 bg-white p-3 rounded-lg shadow-md">
        <div class="text-lg font-semibold" :class="{ 'text-red-500': timeRemaining < 300 }">
          Time Remaining: {{ formatTime(timeRemaining) }}
        </div>
      </div>

      <!-- Progress -->
      <div class="mb-4">
        <div class="flex justify-between text-sm text-gray-600 mb-1">
          <span>Question {{ currentQuestionIndex + 1 }} of {{ questions.length }}</span>
          <span>{{ Math.round((currentQuestionIndex / questions.length) * 100) }}% Complete</span>
        </div>
        <div class="w-full bg-gray-200 rounded-full h-2.5">
          <div
            class="bg-primary h-2.5 rounded-full transition-all duration-300"
            :style="{
              width: `${(currentQuestionIndex / questions.length) * 100}%`
            }"
          ></div>
        </div>
      </div>

      <!-- Current Question -->
      <div v-if="currentQuestion" class="bg-gray-50 rounded-lg p-6">
        <h3 class="text-lg font-semibold mb-4">{{ currentQuestion.question }}</h3>
        <div class="space-y-3">
          <div
            v-for="option in currentQuestion.options"
            :key="option"
            class="flex items-center"
          >
            <input
              type="radio"
              :id="option"
              :value="option"
              v-model="selectedAnswer"
              class="h-4 w-4 text-primary focus:ring-primary border-gray-300"
            />
            <label :for="option" class="ml-3 block text-gray-700">
              {{ option }}
            </label>
          </div>
        </div>
      </div>

      <!-- Navigation -->
      <div class="flex justify-between">
        <button
          @click="previousQuestion"
          :disabled="currentQuestionIndex === 0"
          class="px-4 py-2 text-gray-600 hover:text-gray-800 disabled:opacity-50"
        >
          Previous
        </button>
        <button
          @click="nextQuestion"
          :disabled="!selectedAnswer"
          class="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary disabled:opacity-50"
        >
          {{ isLastQuestion ? 'Submit Test' : 'Next' }}
        </button>
      </div>
    </div>

    <!-- Test Results -->
    <div v-if="testCompleted" class="text-center">
      <div class="mb-6">
        <div 
          class="text-6xl font-bold mb-2" 
          :class="isPassing ? 'text-green-500' : 'text-red-500'"
        >
          {{ score }}%
        </div>
        <p class="text-lg" :class="isPassing ? 'text-green-600' : 'text-red-600'">
          {{ isPassing ? 'Congratulations! You\'ve advanced to the next level!' : 'Keep practicing and try again in 24 hours.' }}
        </p>
      </div>

      <div class="bg-gray-50 rounded-lg p-6 mb-6">
        <h3 class="text-lg font-semibold mb-4">Test Summary</h3>
        <div class="grid grid-cols-2 gap-4 text-center">
          <div>
            <div class="text-2xl font-bold text-green-500">{{ correctAnswers }}</div>
            <div class="text-gray-600">Correct</div>
          </div>
          <div>
            <div class="text-2xl font-bold text-red-500">
              {{ questions.length - correctAnswers }}
            </div>
            <div class="text-gray-600">Incorrect</div>
          </div>
        </div>
      </div>

      <div class="space-x-4">
        <router-link
          :to="isPassing ? `/lessons/${nextLevel}` : `/lessons/${currentLevel}`"
          class="inline-block px-4 py-2 bg-primary text-white rounded-md hover:bg-primary-dark"
        >
          {{ isPassing ? 'Start Next Level' : 'Back to Current Level' }}
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
    
    const testStarted = ref(false);
    const testCompleted = ref(false);
    const questions = ref([]);
    const currentQuestionIndex = ref(0);
    const selectedAnswer = ref('');
    const answers = ref([]);
    const timeRemaining = ref(45 * 60); // 45 minutes in seconds
    const timer = ref(null);
    const canTakeTest = ref(false);
    const currentLevel = route.params.level;
    
    // Computed properties
    const currentQuestion = computed(() => questions.value[currentQuestionIndex.value]);
    const isLastQuestion = computed(() => currentQuestionIndex.value === questions.value.length - 1);
    const score = computed(() => {
      if (!testCompleted.value) return 0;
      return Math.round((correctAnswers.value / questions.value.length) * 100);
    });
    const correctAnswers = computed(() => {
      return answers.value.filter((answer, index) => 
        answer === questions.value[index].answer
      ).length;
    });
    const isPassing = computed(() => score.value >= 80);
    const nextLevel = computed(() => {
      const levels = ['beginner', 'intermediate', 'advanced'];
      const currentIndex = levels.indexOf(currentLevel);
      return levels[currentIndex + 1] || currentLevel;
    });

    // Methods
    const formatTime = (seconds) => {
      const minutes = Math.floor(seconds / 60);
      const remainingSeconds = seconds % 60;
      return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
    };

    const startTimer = () => {
      timer.value = setInterval(() => {
        if (timeRemaining.value > 0) {
          timeRemaining.value--;
        } else {
          submitTest(true);
        }
      }, 1000);
    };

    const checkPrerequisites = async () => {
      try {
        const response = await store.dispatch('lessons/checkLevelTestEligibility', {
          level: currentLevel
        });
        canTakeTest.value = response.eligible;
        if (!canTakeTest.value) {
          NotificationService.showWarning(response.message);
        }
      } catch (error) {
        NotificationService.showError('Failed to check test eligibility');
      }
    };

    const startTest = async () => {
      try {
        const response = await store.dispatch('lessons/getLevelTestQuestions', {
          level: currentLevel
        });
        questions.value = response;
        testStarted.value = true;
        startTimer();
      } catch (error) {
        NotificationService.showError('Failed to start test');
      }
    };

    const submitTest = async (timeout = false) => {
      clearInterval(timer.value);
      try {
        if (timeout) {
          NotificationService.showWarning('Time\'s up! Your test has been submitted.');
        }
        
        const response = await store.dispatch('lessons/submitLevelTest', {
          level: currentLevel,
          answers: answers.value
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

    const nextQuestion = () => {
      if (!selectedAnswer.value) return;
      
      answers.value[currentQuestionIndex.value] = selectedAnswer.value;
      
      if (isLastQuestion.value) {
        submitTest();
      } else {
        currentQuestionIndex.value++;
        selectedAnswer.value = answers.value[currentQuestionIndex.value] || '';
      }
    };

    const previousQuestion = () => {
      if (currentQuestionIndex.value > 0) {
        answers.value[currentQuestionIndex.value] = selectedAnswer.value;
        currentQuestionIndex.value--;
        selectedAnswer.value = answers.value[currentQuestionIndex.value] || '';
      }
    };

    // Lifecycle hooks
    onMounted(() => {
      checkPrerequisites();
    });

    onUnmounted(() => {
      if (timer.value) {
        clearInterval(timer.value);
      }
    });

    return {
      testStarted,
      testCompleted,
      questions,
      currentQuestionIndex,
      selectedAnswer,
      timeRemaining,
      canTakeTest,
      currentLevel,
      currentQuestion,
      isLastQuestion,
      score,
      correctAnswers,
      isPassing,
      nextLevel,
      formatTime,
      startTest,
      nextQuestion,
      previousQuestion
    };
  }
};
</script>
