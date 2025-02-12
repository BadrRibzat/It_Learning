<template>
  <div class="bg-white rounded-lg shadow p-4">
    <div class="flex items-start justify-between">
      <div>
        <p class="text-sm text-gray-600">{{ title }}</p>
        <p class="mt-1 text-2xl font-semibold">
          {{ value }}{{ suffix }}
        </p>
      </div>
      <component
        :is="icon"
        class="w-6 h-6"
        :class="iconColorClass"
      />
    </div>
    <div v-if="trend" class="mt-2">
      <span
        :class="[
          'text-sm',
          trend === 'up' ? 'text-green-600' : 'text-red-600'
        ]"
      >
        {{ percent }}%
      </span>
      <span class="text-gray-600 text-sm ml-1">vs last week</span>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';

const props = defineProps<{
  title: string;
  value: string | number;
  icon: string;
  trend?: 'up' | 'down';
  percent?: number;
  variant?: 'primary' | 'success' | 'warning' | 'info';
  suffix?: string;
}>();

const iconColorClass = computed(() => {
  const variants = {
    primary: 'text-primary-600',
    success: 'text-green-600',
    warning: 'text-yellow-600',
    info: 'text-blue-600'
  };
  return variants[props.variant || 'primary'];
});
</script>

<style scoped>
@import '../../assets/main.css';
</style>