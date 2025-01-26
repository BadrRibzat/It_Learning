<template>
  <div class="min-h-screen bg-gray-50 py-8">
    <div class="max-w-4xl mx-auto px-4">
      <FlashcardsComponent />
    </div>
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
