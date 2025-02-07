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
          title="Level Progress"
          :progress="currentLevel?.level_progress || 0"
          color="#10B981"
        />
        <ProgressCircle
          title="Current Streak"
          :progress="stats?.streak?.current_streak || 0"
          :max-value="stats?.streak?.next_milestone || 10"
          color="#6366F1"
          show-days
        />
      </div>

      <!-- Progress Bars -->
      <div class="space-y-4">
        <div v-for="(item, index) in progressItems" :key="index" class="space-y-2">
          <div class="flex justify-between text-sm">
            <span class="text-gray-600">{{ item.label }}</span>
            <span class="font-medium">{{ item.value }}%</span>
          </div>
          <div class="h-2 bg-gray-200 rounded-full overflow-hidden">
            <div
              class="h-full rounded-full transition-all duration-500"
              :class="item.color"
              :style="{ width: `${item.value}%` }"
            />
          </div>
        </div>
      </div>

      <!-- Milestones -->
      <div v-if="currentLevel?.milestones?.length" class="mt-6">
        <h3 class="text-lg font-medium mb-4">Current Milestones</h3>
        <div class="space-y-4">
          <div 
            v-for="milestone in currentLevel.milestones" 
            :key="milestone.id"
            class="flex items-center space-x-4"
          >
            <div 
              class="w-8 h-8 rounded-full flex items-center justify-center"
              :class="milestone.completed ? 'bg-green-100 text-green-600' : 'bg-gray-100 text-gray-400'"
            >
              <check-circle-icon v-if="milestone.completed" class="w-5 h-5" />
              <clock-icon v-else class="w-5 h-5" />
            </div>
            <div>
              <p class="font-medium">{{ milestone.title }}</p>
              <p class="text-sm text-gray-600">{{ milestone.description }}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { CheckCircleIcon, ClockIcon } from '@heroicons/vue/24/outline';
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
      label: 'Lessons Completed',
      value: Math.round((props.stats.completed_lessons || 0) / 100 * 100),
      color: 'bg-blue-500'
    },
    {
      label: 'Quiz Performance',
      value: Math.round((props.stats.quiz_average || 0) * 100),
      color: 'bg-green-500'
    },
    {
      label: 'Accuracy Rate',
      value: Math.round((props.stats.accuracy_rate || 0) * 100),
      color: 'bg-purple-500'
    }
  ];
});
</script>
