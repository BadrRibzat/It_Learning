<template>
  <div class="flex flex-col items-center">
    <h3 class="text-sm font-medium text-gray-700 mb-2">{{ title }}</h3>
    <div class="relative">
      <svg
        class="transform -rotate-90 w-24 h-24"
        viewBox="0 0 100 100"
      >
        <!-- Background circle -->
        <circle
          cx="50"
          cy="50"
          r="45"
          stroke="#E5E7EB"
          stroke-width="10"
          fill="none"
        />
        <!-- Progress circle -->
        <circle
          cx="50"
          cy="50"
          r="45"
          :stroke="color"
          stroke-width="10"
          fill="none"
          :stroke-dasharray="circumference"
          :stroke-dashoffset="dashOffset"
          class="transition-all duration-1000 ease-out"
        />
      </svg>
      <div class="absolute inset-0 flex items-center justify-center">
        <span class="text-xl font-bold">
          {{ showDays ? `${value}d` : `${percentage}%` }}
        </span>
      </div>
    </div>
    <p v-if="subtitle" class="mt-2 text-sm text-gray-600">
      {{ subtitle }}
    </p>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';

const props = withDefaults(defineProps<{
  title: string;
  progress: number;
  maxValue?: number;
  color?: string;
  showDays?: boolean;
  subtitle?: string;
}>(), {
  maxValue: 100,
  color: '#0284c7',
  showDays: false
});

const circumference = 2 * Math.PI * 45;

const percentage = computed(() => {
  return Math.round((props.progress / props.maxValue) * 100);
});

const dashOffset = computed(() => {
  return circumference * (1 - props.progress / props.maxValue);
});

const value = computed(() => {
  return Math.round(props.progress);
});
</script>
