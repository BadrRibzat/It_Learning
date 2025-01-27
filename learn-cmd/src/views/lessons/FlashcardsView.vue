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
    
    <FlashcardsComponent :level="$route.params.level" />
  </div>
</template>

<script>
import FlashcardsComponent from '@/components/lessons/FlashcardsComponent.vue';

export default {
  name: 'FlashcardsView',
  components: {
    FlashcardsComponent
  }
};
</script>
