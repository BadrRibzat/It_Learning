<template>
  <div class="progress-circle text-center">
    <div class="relative inline-block">
      <svg class="w-32 h-32" viewBox="0 0 36 36">
        <path
          class="circle-bg"
          d="M18 2.0845
             a 15.9155 15.9155 0 0 1 0 31.831
             a 15.9155 15.9155 0 0 1 0 -31.831"
        />
        <path
          class="circle"
          stroke-dasharray="100, 100"
          :stroke-dasharray="`${progress}, 100`"
          :style="{ stroke: color || '#4caf50' }"
          d="M18 2.0845
             a 15.9155 15.9155 0 0 1 0 31.831
             a 15.9155 15.9155 0 0 1 0 -31.831"
        />
      </svg>
      <div class="absolute inset-0 flex items-center justify-center">
        <span class="text-xl font-semibold">{{ progress }}%</span>
      </div>
    </div>
    <p class="mt-2 text-sm text-gray-600">{{ title }}</p>
  </div>
</template>

<script setup lang="ts">
import { defineProps } from 'vue';

const props = defineProps<{
  title: string;
  progress: number;
  color?: string;
}>();
</script>

<style scoped>
.progress-circle .circle-bg {
  fill: none;
  stroke: #eee;
  stroke-width: 3.8;
}

.progress-circle .circle {
  fill: none;
  stroke-width: 2.8;
  stroke-linecap: round;
  transition: stroke-dasharray 0.3s;
}

.progress-circle span {
  color: #4caf50;
}

.progress-circle p {
  margin-top: 0.5rem;
}

.progress-circle .circle-bg {
  stroke: #eee;
}

.progress-circle .circle {
  stroke: #4caf50;
}

.progress-circle span {
  color: #4caf50;
}

.progress-circle p {
  margin-top: 0.5rem;
}

.progress-circle .circle-bg {
  stroke: #eee;
}

.progress-circle .circle {
  stroke: #4caf50;
}

.progress-circle span {
  color: #4caf50;
}

.progress-circle p {
  margin-top: 0.5rem;
}

</style>