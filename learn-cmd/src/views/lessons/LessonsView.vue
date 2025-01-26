<template>
  <div class="min-h-screen bg-gray-50">
    <LessonsComponent />
  </div>
</template>

<script>
import LessonsComponent from '@/components/lessons/LessonsComponent.vue';

export default {
  name: 'LessonsView',
  components: {
    LessonsComponent
  }
};
</script>
