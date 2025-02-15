<template>
  <div class="bg-white rounded-lg shadow p-6">
    <h2 class="text-xl font-semibold mb-6">Learning Progress</h2>
    
    <div v-if="loading" class="flex justify-center py-8">
      <LoadingSpinner />
    </div>
    
    <div v-else class="space-y-6">
      <!-- Progress Overview -->
      <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
        <ProgressCircle
          title="Overall Progress"
          :progress="currentLevel?.overall_progress || 0"
          :color="currentLevel?.animations?.circle_color || '#0284c7'"
        />
        <ProgressCircle
          title="Lessons Completed"
          :progress="(stats?.completed_lessons || 0) / (stats?.total_lessons || 1) * 100"
          color="#10B981"
        />
        <ProgressCircle
          title="Points Progress"
          :progress="currentLevel?.points_progress || 0"
          color="#6366F1"
        />
      </div>

      <!-- Progress Bars -->
      <div class="space-y-4">
        <div v-for="(item, index) in progressItems" :key="index" class="space-y-2">
          <div class="flex justify-between text-sm">
            <span class="text-gray-600">{{ item.label }}</span>
            <span class="font-medium">{{ item.value }}{{ item.suffix }}</span>
          </div>
          <div class="h-2 bg-gray-200 rounded-full overflow-hidden">
            <div
              class="h-full rounded-full transition-all duration-500"
              :class="item.color"
              :style="{ width: `${item.progress}%` }"
            />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import type { LearningStats, CurrentLevel } from '@/types/profile';
import LoadingSpinner from '@/components/common/LoadingSpinner.vue';
import ProgressCircle from './ProgressCircle.vue';

const props = defineProps<{
  stats?: LearningStats;
  currentLevel?: CurrentLevel;
  loading?: boolean;
}>();

const progressItems = computed(() => {
  if (!props.stats) return [];

  return [
    {
      label: 'Lessons Progress',
      value: `${props.stats.completed_lessons || 0}/${props.stats.total_lessons || 0}`,
      progress: ((props.stats.completed_lessons || 0) / (props.stats.total_lessons || 1)) * 100,
      color: 'bg-blue-500',
      suffix: ' lessons'
    },
    {
      label: 'Points Earned',
      value: props.stats.total_points || 0,
      progress: (props.stats.total_points || 0) / 1000 * 100,
      color: 'bg-green-500',
      suffix: ' points'
    },
    {
      label: 'Current Streak',
      value: props.stats.streak?.current_streak || 0,
      progress: ((props.stats.streak?.current_streak || 0) / 7) * 100,
      color: 'bg-purple-500',
      suffix: ' days'
    }
  ];
});
</script>
