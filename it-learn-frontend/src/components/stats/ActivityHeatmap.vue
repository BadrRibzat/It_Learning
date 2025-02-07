<template>
  <div class="p-4 bg-white rounded-lg">
    <div class="grid grid-cols-7 gap-1">
      <div
        v-for="(day, index) in activityData"
        :key="index"
        class="w-4 h-4 rounded-sm"
        :class="getActivityColor(day.value)"
        :title="`${formatDate(day.date)}: ${day.value} points`"
      />
    </div>
    <div class="mt-4 flex items-center justify-end space-x-2 text-xs text-gray-600">
      <span>Less</span>
      <div class="flex space-x-1">
        <div 
          v-for="level in activityLevels" 
          :key="level"
          class="w-3 h-3 rounded-sm"
          :class="getActivityColor(level)"
        />
      </div>
      <span>More</span>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';

const props = defineProps<{
  activities: Array<{ date: Date; value: number }>;
  startDate: Date;
}>();

const activityLevels = [0, 1, 2, 5, 10];

const activityData = computed(() => {
  const days = new Array(7 * 5).fill(null).map((_, index) => {
    const date = new Date(props.startDate);
    date.setDate(date.getDate() - index);
    const activity = props.activities.find(
      a => a.date.toDateString() === date.toDateString()
    );
    return {
      date,
      value: activity?.value || 0
    };
  }).reverse();
  return days;
});

const getActivityColor = (value: number) => {
  if (value === 0) return 'bg-gray-100';
  if (value < 2) return 'bg-primary-100';
  if (value < 5) return 'bg-primary-300';
  if (value < 10) return 'bg-primary-500';
  return 'bg-primary-700';
};

const formatDate = (date: Date) => {
  return date.toLocaleDateString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric'
  });
};
</script>
