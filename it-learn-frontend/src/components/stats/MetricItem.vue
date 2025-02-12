<template>
  <div class="flex items-center justify-between">
    <div>
      <p class="text-sm text-gray-600">{{ label }}</p>
      <p class="text-xl font-semibold">{{ formattedValue }}</p>
    </div>
    <div 
      v-if="change !== undefined"
      class="flex items-center"
      :class="changeColor"
    >
      <ArrowUpIcon 
        v-if="change > 0"
        class="w-4 h-4 mr-1"
      />
      <ArrowDownIcon
        v-else-if="change < 0"
        class="w-4 h-4 mr-1"
      />
      <span>{{ Math.abs(change) }}%</span>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { ArrowUpIcon, ArrowDownIcon } from '@heroicons/vue/24/outline';

const props = defineProps<{
  label: string;
  value: number | null;
  format: 'number' | 'percentage' | 'time' | 'days';
  change?: number;
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
    default:
      return props.value.toLocaleString();
  }
});

const changeColor = computed(() => {
  if (props.change === undefined) return '';
  return props.change > 0 ? 'text-green-600' : 'text-red-600';
});
</script>

<style scoped>
.value {
  font-size: 1.25rem;
}

.change {
  font-size: 0.875rem;
}

.text-green-600 {
  color: #10b981;
}

.text-red-600 {
  color: #ef4444;
}

.arrow-up {
  color: #10b981;
}

.arrow-down {
  color: #ef4444;
}

.arrow-up,
.arrow-down {
  width: 1rem;
  height: 1rem;
}
</style>