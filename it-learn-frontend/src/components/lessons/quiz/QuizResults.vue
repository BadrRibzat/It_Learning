<script setup lang="ts">
import { onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useNotificationStore } from '@/stores/notification';
import { useProfileStore } from '@/stores/profile';
import { useLessonsStore } from '@/stores/lessons';
import { ProgressTracker } from '@/utils/progressTracker';
import type { QuizSubmissionResponse } from '@/types/lessons';

const props = defineProps<{
  results: QuizSubmissionResponse;
}>();

const emit = defineEmits<{
  (e: 'retry'): void;
}>();

const router = useRouter();
const notificationStore = useNotificationStore();
const profileStore = useProfileStore();
const lessonsStore = useLessonsStore();

const handleQuizCompletion = async () => {
  if (props.results.passed) {
    notificationStore.success(
      `Congratulations! You passed with ${props.results.score}% and earned ${props.results.points_earned} points!`
    );

    await profileStore.updateLearningStats({
      points_earned: props.results.points_earned,
      correct_answers: props.results.correct_answers,
      total_questions: props.results.total_questions,
      completed_lessons: props.results.next_lesson_unlocked ? 1 : 0
    });

    if (props.results.next_lesson_unlocked) {
      notificationStore.info('New lesson unlocked! Keep up the great work!');
      await profileStore.checkAchievements('lesson_completion');
    }

    await profileStore.trackActivity('quiz_complete', {
      score: props.results.score,
      points_earned: props.results.points_earned
    });
  } else {
    notificationStore.warning(
      `You need ${props.results.passing_score}% to pass. Keep practicing!`
    );
  }
};

const goToNextLesson = async () => {
  try {
    await ProgressTracker.updateProgress('quiz', props.results);
    router.push({
      name: 'lesson',
      params: { 
        lessonId: props.results.next_lesson_id 
      }
    });
  } catch (error) {
    notificationStore.error('Failed to proceed to next lesson. Please try again.');
  }
};

const retryQuiz = () => {
  notificationStore.info('Starting quiz again. Good luck!');
  emit('retry');
};

onMounted(async () => {
  await handleQuizCompletion();
});
</script>

<template>
  <div class="quiz-results bg-white rounded-lg shadow-lg p-8 max-w-2xl mx-auto">
    <div class="text-center mb-8">
      <h2 class="text-2xl font-bold text-gray-900 mb-4">
        Quiz Results
      </h2>
      
      <div class="flex justify-center items-center space-x-4 mb-6">
        <div class="text-4xl font-bold" 
             :class="results.passed ? 'text-green-600' : 'text-red-600'">
          {{ results.score }}%
        </div>
        <div class="text-lg text-gray-600">
          {{ results.correct_answers }}/{{ results.total_questions }} Correct
        </div>
      </div>

      <div class="points-earned mb-6">
        <span class="text-xl font-semibold text-primary-600">
          +{{ results.points_earned }} points earned
        </span>
      </div>
    </div>

    <div class="question-review mb-8">
      <h3 class="text-lg font-semibold mb-4">Question Review</h3>
      <div class="space-y-4">
        <div v-for="(qa, index) in results.questions_with_answers" 
             :key="index"
             class="p-4 rounded-lg"
             :class="qa.is_correct ? 'bg-green-50' : 'bg-red-50'">
          <div class="flex justify-between mb-2">
            <span class="font-medium">Question {{ index + 1 }}</span>
            <span :class="qa.is_correct ? 'text-green-600' : 'text-red-600'">
              {{ qa.is_correct ? 'Correct' : 'Incorrect' }}
            </span>
          </div>
          <p class="text-gray-700 mb-2">{{ qa.question }}</p>
          <p class="text-sm">
            <span class="text-gray-600">Your answer: </span>
            <span :class="qa.is_correct ? 'text-green-600' : 'text-red-600'">
              {{ qa.user_answer }}
            </span>
          </p>
          <p v-if="!qa.is_correct" class="text-sm text-gray-600 mt-1">
            Correct answer: {{ qa.correct_answer }}
          </p>
        </div>
      </div>
    </div>

    <div class="flex justify-center space-x-4">
      <button v-if="results.passed && results.next_lesson_unlocked"
              @click="goToNextLesson"
              class="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors">
        Continue to Next Lesson
      </button>
      
      <button v-if="!results.passed"
              @click="retryQuiz"
              class="px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors">
        Try Again
      </button>
    </div>
  </div>
</template>

<style scoped>
.quiz-results {
  animation: fadeIn 0.5s ease-out;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>
