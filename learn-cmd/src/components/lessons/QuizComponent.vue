<template>
  <div class="bg-white rounded-lg shadow-lg p-6">
    <div class="mb-6">
      <h2 class="text-2xl font-bold text-gray-900">Level Quiz</h2>
      <p class="text-gray-600" v-if="!quizStarted">
        Test your knowledge to progress to the next level
      </p>
    </div>

    <!-- Quiz Start Screen -->
    <div v-if="!quizStarted && !quizCompleted" class="text-center">
      <div class="mb-6 p-4 bg-gray-50 rounded-lg">
        <h3 class="text-lg font-semibold mb-2">Quiz Rules</h3>
        <ul class="text-left text-gray-600 space-y-2">
          <li><i class="fas fa-check-circle text-green-500 mr-2"></i>5 questions to complete</li>
          <li><i class="fas fa-clock text-blue-500 mr-2"></i>No time limit</li>
          <li><i class="fas fa-star text-yellow-500 mr-2"></i>Required score: 80%</li>
        </ul>
      </div>
      <button
        @click="startQuiz"
        class="px-6 py-3 bg-primary text-white rounded-md hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
      >
        Start Quiz
      </button>
    </div>

    <!-- Quiz Questions -->
    <div v-if="quizStarted && !quizCompleted" class="space-y-6">
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
          <button
            v-for="option in currentQuestion.options"
            :key="option"
            @click="selectAnswer(option)"
            :class="[
              'w-full text-left p-3 rounded-md transition-colors',
              selectedAnswer === option
                ? 'bg-primary text-white'
                : 'bg-white hover:bg-gray-100'
            ]"
          >
            {{ option }}
          </button>
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
          {{ isLastQuestion ? 'Submit Quiz' : 'Next' }}
        </button>
      </div>
    </div>

    <!-- Quiz Results -->
    <div v-if="quizCompleted" class="text-center">
      <div class="mb-6">
        <div class="text-6xl font-bold mb-2" :class="isPassing ? 'text-green-500' : 'text-red-500'">
          {{ score }}%
        </div>
        <p class="text-lg" :class="isPassing ? 'text-green-600' : 'text-red-600'">
          {{ isPassing ? 'Congratulations!' : 'Keep Practicing!' }}
        </p>
      </div>

      <div class="bg-gray-50 rounded-lg p-6 mb-6">
        <h3 class="text-lg font-semibold mb-4">Quiz Summary</h3>
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
        <button
          @click="restartQuiz"
          class="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50"
        >
          Try Again
        </button>
        <router-link
          :to="`/lessons/${currentLevel}`"
          class="inline-block px-4 py-2 bg-primary text-white rounded-md hover:bg-primary-dark"
        >
          Back to Lessons
        </router-link>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, computed } from 'vue';
import { useStore } from 'vuex';
import { useRoute, useRouter } from 'vue-router';
import { NotificationService } from '@/utils/NotificationService';

export default {
  name: 'QuizComponent',
  
  setup() {
    const store = useStore();
    const route = useRoute();
    const router = useRouter();
    
    const quizStarted = ref(false);
    const quizCompleted = ref(false);
    const questions = ref([]);
    const currentQuestionIndex = ref(0);
    const selectedAnswer = ref('');
    const answers = ref([]);
    const currentLevel = route.params.level;

    const currentQuestion = computed(() => questions.value[currentQuestionIndex.value]);
    const isLastQuestion = computed(() => currentQuestionIndex.value === questions.value.length - 1);
    
    const score = computed(() => {
      if (!quizCompleted.value) return 0;
      return Math.round((correctAnswers.value / questions.value.length) * 100);
    });

    const correctAnswers = computed(() => {
      return answers.value.filter((answer, index) => 
        answer === questions.value[index].answer
      ).length;
    });

    const isPassing = computed(() => score.value >= 80);

    const startQuiz = async () => {
      try {
        // Fetch quiz questions from store
        const response = await store.dispatch('lessons/getQuizQuestions', {
          level: currentLevel
        });
        questions.value = response;
        quizStarted.value = true;
      } catch (error) {
        NotificationService.showError('Failed to start quiz');
      }
    };

    const selectAnswer = (answer) => {
      selectedAnswer.value = answer;
    };

    const nextQuestion = async () => {
      answers.value[currentQuestionIndex.value] = selectedAnswer.value;
      
      if (isLastQuestion.value) {
        await submitQuiz();
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

    const submitQuiz = async () => {
      try {
        await store.dispatch('lessons/submitQuiz', {
          level: currentLevel,
          answers: answers.value
        });
        quizCompleted.value = true;
        
        if (isPassing.value) {
          NotificationService.showSuccess('Quiz completed successfully!');
        } else {
          NotificationService.showInfo('Keep practicing and try again!');
        }
      } catch (error) {
        NotificationService.showError('Failed to submit quiz');
      }
    };

    const restartQuiz = () => {
      quizStarted.value = false;
      quizCompleted.value = false;
      currentQuestionIndex.value = 0;
      selectedAnswer.value = '';
      answers.value = [];
      questions.value = [];
    };

    return {
      quizStarted,
      quizCompleted,
      questions,
      currentQuestionIndex,
      selectedAnswer,
      currentQuestion,
      isLastQuestion,
      score,
      correctAnswers,
      isPassing,
      currentLevel,
      startQuiz,
      selectAnswer,
      nextQuestion,
      previousQuestion,
      restartQuiz
    };
  }
};
</script>
