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
  totalTime: number;
}>();

const emit = defineEmits<{
  (e: 'time-update', seconds: number): void;
  (e: 'time-expired'): void;
}>();

const elapsedTime = ref(props.totalTime);
let timer: number;

const formattedTime = computed(() => {
  const minutes = Math.floor(elapsedTime.value / 60);
  const seconds = elapsedTime.value % 60;
  return `${minutes}:${seconds.toString().padStart(2, '0')}`;
});

onMounted(() => {
  timer = window.setInterval(() => {
    elapsedTime.value--;
    emit('time-update', elapsedTime.value);

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
