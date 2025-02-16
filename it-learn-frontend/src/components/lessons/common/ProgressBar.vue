<template>
  <div class="progress-bar w-full bg-gray-200 rounded-full h-2.5">
    <div 
      class="bg-primary-600 h-2.5 rounded-full"
      :style="{ width: `${percentage}%` }"
    ></div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';

const props = defineProps<{
  value: number;
  max: number;
}>();

const percentage = computed(() => {
  return (props.value / props.max) * 100;
});
</script>

<style scoped>
.progress-bar {
  overflow: hidden;
}
</style>
