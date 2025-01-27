<template>
  <div class="bg-white rounded-lg shadow-lg p-6">
    <!-- Quiz Header -->
    <div class="flex justify-between items-center mb-6">
      <div>
        <h2 class="text-2xl font-bold text-gray-900">Lesson Quiz</h2>
        <p class="text-gray-600 mt-1">
          Test your knowledge to advance to the next level
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

    <!-- Quiz Start Screen -->
    <div v-if="!quizStarted && !quizCompleted" class="text-center py-8">
      <div class="mb-6 max-w-md mx-auto">
        <div class="bg-gray-50 rounded-lg p-6">
          <h3 class="text-lg font-semibold mb-4">Quiz Rules</h3>
          <ul class="text-left space-y-3">
            <li class="flex items-center">
              <i class="fas fa-clipboard-list text-primary mr-2"></i>
              <span>5 questions to complete</span>
            </li>
            <li class="flex items-center">
              <i class="fas fa-clock text-primary mr-2"></i>
              <span>No time limit</span>
            </li>
            <li class="flex items-center">
              <i class="fas fa-check-circle text-primary mr-2"></i>
              <span>80% required to pass</span>
            </li>
          </ul>
        </div>
      </div>

      <button
        @click="startQuiz"
        class="px-6 py-3 bg-primary text-white rounded-md hover:bg-primary-dark transition-colors"
      >
        Start Quiz
      </button>
    </div>

    <!-- Quiz Questions -->
    <div v-if="quizStarted && !quizCompleted" class="space-y-6">
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

      <!-- Navigation Buttons -->
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
          {{ isLastQuestion ? 'Submit Quiz' : 'Next Question' }}
        </button>
      </div>
    </div>

    <!-- Quiz Results -->
    <div v-if="quizCompleted" class="text-center py-8">
      <div class="mb-8">
        <div 
          class="text-6xl font-bold mb-2"
          :class="isPassing ? 'text-green-500' : 'text-red-500'"
        >
          {{ score }}%
        </div>
        <p class="text-xl" :class="isPassing ? 'text-green-600' : 'text-red-600'">
          {{ isPassing ? 'Congratulations! You passed!' : 'Keep practicing and try again!' }}
        </p>
      </div>

      <div class="max-w-md mx-auto bg-gray-50 rounded-lg p-6 mb-8">
        <h3 class="text-lg font-semibold mb-4">Quiz Summary</h3>
        <div class="grid grid-cols-2 gap-4">
          <div>
            <div class="text-2xl font-bold text-green-500">{{ correctAnswers }}</div>
            <div class="text-sm text-gray-600">Correct</div>
          </div>
          <div>
            <div class="text-2xl font-bold text-red-500">{{ questions.length - correctAnswers }}</div>
            <div class="text-sm text-gray-600">Incorrect</div>
          </div>
        </div>
      </div>

      <div class="space-x-4">
        <button
          v-if="!isPassing"
          @click="restartQuiz"
          class="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50"
        >
          Try Again
        </button>
        
        <router-link
          :to="`/profile/lessons/${currentLevel}`"
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

    const currentLevel = computed(() => route.params.level);
    const lessonId = computed(() => route.query.lesson);
    
    const quizStarted = ref(false);
    const quizCompleted = ref(false);
    const questions = ref([]);
    const currentIndex = ref(0);
    const selectedAnswer = ref('');
    const userAnswers = ref([]);

    const currentQuestion = computed(() => questions.value[currentIndex.value]);
    const isLastQuestion = computed(() => currentIndex.value === questions.value.length - 1);
    
    const score = computed(() => {
      if (!quizCompleted.value) return 0;
      return Math.round((correctAnswers.value / questions.value.length) * 100);
    });

    const correctAnswers = computed(() => {
      return userAnswers.value.filter((answer, index) => 
        answer === questions.value[index].answer
      ).length;
    });

    const isPassing = computed(() => score.value >= 80);

    const startQuiz = async () => {
      try {
        const response = await store.dispatch('lessons/getQuizQuestions', {
          lessonId: lessonId.value
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
      userAnswers.value[currentIndex.value] = selectedAnswer.value;
      
      if (isLastQuestion.value) {
        await submitQuiz();
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

    const submitQuiz = async () => {
      try {
        await store.dispatch('lessons/submitQuiz', {
          lessonId: lessonId.value,
          answers: userAnswers.value
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
      currentIndex.value = 0;
      selectedAnswer.value = '';
      userAnswers.value = [];
      questions.value = [];
    };

    return {
      currentLevel,
      quizStarted,
      quizCompleted,
      questions,
      currentIndex,
      currentQuestion,
      selectedAnswer,
      isLastQuestion,
      score,
      correctAnswers,
      isPassing,
      startQuiz,
      selectAnswer,
      nextQuestion,
      previousQuestion,
      restartQuiz
    };
  }
};
</script>
