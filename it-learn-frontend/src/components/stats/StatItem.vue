<template>
  <div 
    class="stat-item group flex justify-between items-center p-3 rounded-lg transition-colors duration-200 hover:bg-gray-50 dark:hover:bg-gray-800"
  >
    <!-- Label and Value -->
    <div>
      <span class="text-gray-600 dark:text-gray-400 text-sm">
        {{ label }}
      </span>
      <div 
        class="font-medium mt-0.5"
        :class="variantClasses"
      >
        {{ formattedValue }}
      </div>
    </div>

    <!-- Trend and Goal Progress -->
    <div class="flex flex-col items-end">
      <!-- Trend -->
      <div 
        v-if="showTrend && trendPercentage"
        class="flex items-center text-sm"
        :class="trendClasses"
      >
        <svg
          v-if="Number(trendPercentage) !== 0"
          class="w-4 h-4 mr-1"
          :class="{ 'transform rotate-180': Number(trendPercentage) < 0 }"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 10l7-7m0 0l7 7m-7-7v18" />
        </svg>
        {{ Math.abs(Number(trendPercentage)) }}%
      </div>

      <!-- Goal Progress -->
      <div 
        v-if="goal && value !== null"
        class="mt-1 flex items-center space-x-2"
      >
        <div class="w-16 h-1 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
          <div
            class="h-full transition-all duration-500 ease-out"
            :class="{
              'bg-green-500': value >= goal,
              'bg-primary-500': value < goal
            }"
            :style="{ width: `${Math.min((value / goal) * 100, 100)}%` }"
          />
        </div>
        <span class="text-xs text-gray-500 dark:text-gray-400">
          {{ Math.round((value / goal) * 100) }}%
        </span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, watch } from 'vue';
import { useNotificationStore } from '@/stores/notification';

interface Props {
  label: string;
  value: number | null;
  format: 'number' | 'percentage' | 'time' | 'days' | 'points';
  previousValue?: number;
  goal?: number;
  variant?: 'default' | 'success' | 'warning' | 'danger';
  showTrend?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  variant: 'default',
  showTrend: true
});

const emit = defineEmits<{
  (e: 'goal-reached'): void;
  (e: 'value-changed', change: { previous: number; current: number }): void;
}>();

const notificationStore = useNotificationStore();

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
      return `${props.value} ${props.value === 1 ? 'day' : 'days'}`;
    case 'points':
      return `${props.value.toLocaleString()} pts`;
    case 'lessons':
      return `${props.value} ${props.value === 1 ? 'lesson' : 'lessons'}`;
    default:
      return props.value.toLocaleString();
  }
});

const trendPercentage = computed(() => {
  if (!props.previousValue || props.value === null) return null;
  const change = ((props.value - props.previousValue) / props.previousValue) * 100;
  return change.toFixed(1);
});

const trendClasses = computed(() => {
  if (!trendPercentage.value) return '';
  const trend = Number(trendPercentage.value);
  return {
    'text-green-600': trend > 0,
    'text-red-600': trend < 0,
    'text-gray-600': trend === 0
  };
});

const variantClasses = computed(() => {
  const variants = {
    default: 'text-gray-900 dark:text-gray-100',
    success: 'text-green-600 dark:text-green-400',
    warning: 'text-yellow-600 dark:text-yellow-400',
    danger: 'text-red-600 dark:text-red-400'
  };
  return variants[props.variant];
});

watch(() => props.value, (newValue, oldValue) => {
  if (oldValue === null || newValue === null) return;

  emit('value-changed', { previous: oldValue, current: newValue });

  if (props.goal && oldValue < props.goal && newValue >= props.goal) {
    emit('goal-reached');
    notificationStore.success(`Goal reached for ${props.label}!`);
  }
});
</script>

<style scoped>
.stat-item {
  @apply relative overflow-hidden;
}

.stat-item::after {
  content: '';
  @apply absolute inset-0 bg-current opacity-0 transition-opacity duration-200;
}

.stat-item:hover::after {
  @apply opacity-5;
}

@media (prefers-reduced-motion: reduce) {
  .stat-item,
  .stat-item::after {
    @apply transition-none;
  }
}

@media print {
  .stat-item {
    @apply break-inside-avoid;
  }
}

.stat-item .trend {
  @apply flex items-center text-sm;
}

.stat-item .trend svg {
  @apply w-4 h-4 mr-1;
}

.stat-item .goal-progress {
  @apply mt-1 flex items-center space-x-2;
}

.stat-item .goal-progress .bar {
  @apply w-16 h-1 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden;
}

.stat-item .goal-progress .bar .progress {
  @apply h-full transition-all duration-500 ease-out;
}

.stat-item .goal-progress .bar .progress.goal-reached {
  @apply bg-green-500;
}

.stat-item .goal-progress .bar .progress.goal-not-reached {
  @apply bg-primary-500;
}

.stat-item .goal-progress .percentage {
  @apply text-xs text-gray-500 dark:text-gray-400;
}

.stat-item .goal-progress .percentage.goal-reached {
  @apply text-green-500;
}

.stat-item .goal-progress .percentage.goal-not-reached {
  @apply text-primary-500;
}

.stat-item .goal-progress .percentage.goal-reached::after {
  @apply content-['✔'] ml-1;
}

.stat-item .goal-progress .percentage.goal-not-reached::after {
  @apply content-['✘'] ml-1;
}

.stat-item .goal-progress .percentage.goal-reached::after,
.stat-item .goal-progress .percentage.goal-not-reached::after {
  @apply text-sm;
}
</style>
