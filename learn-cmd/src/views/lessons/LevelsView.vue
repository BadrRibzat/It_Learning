<template>
  <div class="container mx-auto px-4 py-8">
    <LevelProgressComponent />
    <div class="mt-8">
      <router-view></router-view>
    </div>
  </div>
</template>

<script>
import LevelProgressComponent from '@/components/lessons/LevelProgressComponent.vue';

export default {
  name: 'LevelsView',
  components: {
    LevelProgressComponent
  }
};
</script>
