<template>
  <div class="min-h-screen bg-gray-50 py-8">
    <div class="max-w-4xl mx-auto px-4">
      <QuizComponent />
    </div>
  </div>
</template>

<script>
import QuizComponent from '@/components/lessons/QuizComponent.vue';

export default {
  name: 'QuizView',
  components: {
    QuizComponent
  }
};
</script>
