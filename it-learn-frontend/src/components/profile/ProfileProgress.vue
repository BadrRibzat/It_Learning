<template>
  <div class="bg-white rounded-lg shadow p-6">
    <h2 class="text-xl font-semibold mb-6">Learning Progress</h2>
    
    <div v-if="loading" class="flex justify-center py-8">
      <LoadingSpinner />
    </div>
    
    <div v-else>
      <!-- Progress Circles -->
      <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <!-- Overall Progress -->
        <ProgressCircle
          title="Overall Progress"
          :progress="stats?.overall_progress || 0"
          :color="currentLevel?.animations?.circle_color || '#FF6B6B'"
        />

        <!-- Level Progress -->
        <ProgressCircle
          title="Level Progress"
          :progress="currentLevel?.level_progress || 0"
          color="#3B82F6"
        />

        <!-- Streak -->
        <ProgressCircle
          title="Current Streak"
          :progress="stats?.streak?.current_streak || 0"
          :max-value="stats?.streak?.next_milestone || 10"
          :show-days="true"
          color="#10B981"
        />
      </div>

      <!-- Milestone Celebrations -->
      <div v-if="currentLevel?.animations?.celebration" class="celebration-animation">
        🎉 Congratulations on reaching a new milestone! 🎉
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
</script>
