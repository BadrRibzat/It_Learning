<template>
  <div class="container mx-auto px-4 py-8">
    <div class="mb-6">
      <router-link 
        :to="`/profile/lessons/${$route.params.level}`"
        class="text-primary hover:text-primary-dark"
      >
        <i class="fas fa-arrow-left mr-2"></i>
        Back to Lessons
      </router-link>
    </div>

    <QuizComponent 
      :level="$route.params.level"
      @quiz-completed="handleQuizCompletion"
    />
  </div>
</template>

<script>
import { useRouter } from 'vue-router';
import QuizComponent from '@/components/lessons/QuizComponent.vue';
import { NotificationService } from '@/utils/NotificationService';

export default {
  name: 'QuizView',
  components: {
    QuizComponent
  },
  setup() {
    const router = useRouter();

    const handleQuizCompletion = (result) => {
      if (result.passed) {
        NotificationService.showSuccess('Quiz completed successfully!');
        // Optionally redirect to next level or back to lessons
        router.push(`/profile/lessons/${result.nextLevel || result.currentLevel}`);
      }
    };

    return {
      handleQuizCompletion
    };
  }
};
</script>
