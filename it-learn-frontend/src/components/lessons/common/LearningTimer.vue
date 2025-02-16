<template>
  <div class="learning-timer">
    <div class="flex items-center space-x-2 text-sm text-gray-600">
      <ClockIcon class="w-5 h-5" />
      <span>Time Remaining: {{ formattedTimeRemaining }}</span>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted, defineEmits } from 'vue';
import ClockIcon from '@heroicons/vue/24/outline/ClockIcon.vue';

const props = defineProps<{
  totalTime: number; // Total time in seconds
}>();

const emit = defineEmits(['time-expired']);

const elapsedTime = ref(props.totalTime);

const formattedTimeRemaining = computed(() => {
  const minutes = Math.floor(elapsedTime.value / 60);
  const seconds = elapsedTime.value % 60;
  return `${minutes}:${seconds.toString().padStart(2, '0')}`;
});

let timer: number;

onMounted(() => {
  timer = window.setInterval(() => {
    elapsedTime.value--;
    if (elapsedTime.value <= 0) {
      clearInterval(timer);
      emit('time-expired');
    }
  }, 1000);
});

onUnmounted(() => {
  clearInterval(timer);
});
</script>

<style scoped>
.learning-timer {
  margin-bottom: 1rem;
}
</style>
