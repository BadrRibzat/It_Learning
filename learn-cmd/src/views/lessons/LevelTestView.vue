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

    <LevelTestComponent 
      :level="$route.params.level"
      @test-completed="handleTestCompletion"
    />
  </div>
</template>

<script>
import { useRouter } from 'vue-router';
import { useStore } from 'vuex';
import LevelTestComponent from '@/components/lessons/LevelTestComponent.vue';
import { NotificationService } from '@/utils/NotificationService';

export default {
  name: 'LevelTestView',
  components: {
    LevelTestComponent
  },
  setup() {
    const router = useRouter();
    const store = useStore();

    const handleTestCompletion = async (result) => {
      if (result.passed) {
        await store.dispatch('lessons/fetchLevelProgression');
        NotificationService.showSuccess('Congratulations! You\'ve advanced to the next level!');
        router.push(`/profile/lessons/${result.nextLevel}`);
      } else {
        NotificationService.showInfo('Keep practicing and try again when you\'re ready!');
        router.push(`/profile/lessons/${result.currentLevel}`);
      }
    };

    return {
      handleTestCompletion
    };
  }
};
</script>
