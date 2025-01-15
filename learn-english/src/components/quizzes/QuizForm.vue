<template>
  <div class="quiz-form p-10">
    <h2 class="text-2xl font-bold text-center text-primary mb-8">
      Quiz for {{ lessonTitle }}
    </h2>
    <form @submit.prevent="submitQuiz">
      <div v-for="(question, index) in quizQuestions" :key="index" class="mb-6">
        <p class="text-lg font-semibold text-gray-800 mb-2">
          {{ index + 1 }}. {{ question.questionText }}
        </p>
        <div v-if="question.type === 'fill-in-blank'">
          <input
            v-model="userAnswers[index]"
            type="text"
            :placeholder="question.blankPlaceholder || 'Your answer'"
            class="w-full p-2 border border-gray-300 rounded-lg"
          />
        </div>
        <!-- Add other question types here if needed -->
      </div>
      <div class="text-center">
        <button
          type="submit"
          class="bg-primary hover:bg-primary-dark text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
        >
          Submit Quiz
        </button>
      </div>
    </form>
    <div v-if="submissionFeedback" class="mt-6 text-center">
      <p
        class="text-lg"
        :class="submissionFeedback.isPassed ? 'text-green-600' : 'text-red-600'"
      >
        {{ submissionFeedback.message }}
      </p>
      <p v-if="!submissionFeedback.isPassed">
        Correct Answers: {{ submissionFeedback.correctAnswers }}/{{ quizQuestions.length }}
      </p>
      <button
        v-if="submissionFeedback.isPassed"
        @click="navigateToNext()"
        class="mt-4 bg-primary hover:bg-primary-dark text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
      >
        Continue
      </button>
    </div>
  </div>
</template>

<script>
import { ref, reactive, computed } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { progressState } from '@/utils/progress';

export default {
  name: 'QuizForm',
  props: {
    lessonId: {
      type: Number,
      required: true,
    },
    lessonTitle: {
      type: String,
      required: true,
    },
  },
  setup(props) {
    const router = useRouter();
    const route = useRoute();
    const userAnswers = ref([]);
    const submissionFeedback = ref(null);

    // Mock quiz questions based on lessonId
    const quizQuestions = computed(() => {
      // Replace this with actual logic to fetch/determine quiz questions for the lesson
      const mockedQuizzes = {
        1: [ // Quiz for lesson ID 1
          { type: 'fill-in-blank', questionText: 'The capital of France is _____.', correctAnswer: 'Paris', blankPlaceholder: 'Fill the blank' },
          { type: 'fill-in-blank', questionText: 'Two plus two equals _____.', correctAnswer: '4', blankPlaceholder: 'Fill the blank' },
        ],
        2: [ // Quiz for lesson ID 2
          { type: 'fill-in-blank', questionText: 'An example of a common greeting is _____.', correctAnswer: 'Hello', blankPlaceholder: 'Fill the blank' },
          { type: 'fill-in-blank', questionText: 'A synonym for "representative instance" is _____.', correctAnswer: 'Example', blankPlaceholder: 'Fill the blank' },
        ],
      };
      return mockedQuizzes[props.lessonId] || [];
    });

    const submitQuiz = () => {
      if (quizQuestions.value.length === 0) return;

      let correctCount = 0;
      quizQuestions.value.forEach((question, index) => {
        const userAnswer = userAnswers.value[index] ? userAnswers.value[index].trim().toLowerCase() : '';
        if (userAnswer === question.correctAnswer.toLowerCase()) {
          correctCount++;
        }
      });

      const isPassed = (correctCount / quizQuestions.value.length) >= 0.7; // Mock passing score

      submissionFeedback.value = {
        isPassed: isPassed,
        message: isPassed ? 'Congratulations! You passed the quiz!' : 'Nice try! You did not pass the quiz.',
        correctAnswers: correctCount,
      };

      if (isPassed) {
        progressState.incrementProgress(); // Update overall progress
        // Update specific quiz completion status (mocked)
        // Here you would typically call an API to update the backend
      }
    };

    const navigateToNext = () => {
      // Mock navigation to the next step after the quiz
      // For now, let's go back to the profile page
      router.push('/profile');
    };

    return {
      quizQuestions,
      userAnswers,
      submitQuiz,
      submissionFeedback,
      navigateToNext,
    };
  },
};
</script>

<style scoped>
/* Add custom styles for the quiz form */
</style>
