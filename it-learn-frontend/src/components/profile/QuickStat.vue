<template>
  <div class="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
    <div class="flex items-center space-x-3">
      <div 
        class="p-2 rounded-lg"
        :class="[`bg-${color}-100 text-${color}-600`]"
      >
        <component
          :is="iconComponent"
          class="w-5 h-5"
        />
      </div>
      <div>
        <p class="text-sm text-gray-600">{{ label }}</p>
        <p class="text-lg font-semibold">
          {{ formattedValue }}{{ suffix }}
        </p>
      </div>
    </div>
    <div v-if="trend" class="text-sm">
      <span
        :class="[
          trend > 0 ? 'text-green-600' : 'text-red-600',
          'flex items-center'
        ]"
      >
        <arrow-up-icon 
          v-if="trend > 0" 
          class="w-4 h-4 mr-1"
        />
        <arrow-down-icon 
          v-else 
          class="w-4 h-4 mr-1"
        />
        {{ Math.abs(trend) }}%
      </span>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import {
  TrophyIcon,
  FireIcon,
  StarIcon,
  BookOpenIcon,
  ChartBarIcon,
  ArrowUpIcon,
  ArrowDownIcon
} from '@heroicons/vue/24/outline';

interface Props {
  label: string;
  value: number;
  icon: 'TrophyIcon' | 'FireIcon' | 'StarIcon' | 'BookOpenIcon' | 'ChartBarIcon';
  color?: string;
  trend?: number;
  suffix?: string;
}

const props = withDefaults(defineProps<Props>(), {
  color: 'primary'
});

const iconComponent = computed(() => {
  const icons = {
    TrophyIcon,
    FireIcon,
    StarIcon,
    BookOpenIcon,
    ChartBarIcon
  };
  return icons[props.icon];
});

const formattedValue = computed(() => {
  if (typeof props.value === 'number') {
    return props.value.toLocaleString();
  }
  return props.value;
});
</script>
