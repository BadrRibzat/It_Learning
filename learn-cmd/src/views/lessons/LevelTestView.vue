<template>
  <div class="min-h-screen bg-gray-50 py-8">
    <div class="max-w-4xl mx-auto px-4">
      <LevelTestComponent />
    </div>
  </div>
</template>

<script>
import LevelTestComponent from '@/components/lessons/LevelTestComponent.vue';

export default {
  name: 'LevelTestView',
  components: {
    LevelTestComponent
  }
};
</script>
