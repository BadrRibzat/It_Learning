<template>
  <div class="flex justify-between items-center">
    <span class="text-gray-600">{{ label }}</span>
    <span class="font-medium">{{ formattedValue }}</span>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'; // Add this import

const props = defineProps<{
  label: string;
  value: number | null;
  format: 'number' | 'percentage' | 'time' | 'days' | 'points';
}>();

const formattedValue = computed(() => {
  if (props.value === null) return 'N/A';

  switch (props.format) {
    case 'percentage':
      return `${(props.value * 100).toFixed(1)}%`;
    case 'time':
      const hours = Math.floor(props.value / 60);
      const minutes = props.value % 60;
      return `${hours}h ${minutes}m`;
    case 'days':
      return `${props.value} days`;
    case 'points':
      return `${props.value} pts`;
    default:
      return props.value.toLocaleString();
  }
});
</script>
