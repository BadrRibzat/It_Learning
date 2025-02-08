<template>
  <div class="learning-timer">
    <div class="flex items-center space-x-2 text-sm text-gray-600">
      <ClockIcon class="w-5 h-5" />
      <span>Time Spent: {{ formattedTime }}</span>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue';
import { ClockIcon } from '@heroicons/vue/24/outline';

const props = defineProps<{
  startTime?: number;
}>();

const emit = defineEmits<{
  (e: 'time-update', seconds: number): void;
}>();

const elapsedTime = ref(0);
let timer: number;

const formattedTime = computed(() => {
  const minutes = Math.floor(elapsedTime.value / 60);
  const seconds = elapsedTime.value % 60;
  return `${minutes}:${seconds.toString().padStart(2, '0')}`;
});

onMounted(() => {
  const start = props.startTime || Date.now();
  timer = window.setInterval(() => {
    elapsedTime.value = Math.floor((Date.now() - start) / 1000);
    emit('time-update', elapsedTime.value);
  }, 1000);
});

onUnmounted(() => {
  clearInterval(timer);
});
</script>
