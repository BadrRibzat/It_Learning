<template>
  <div class="progress-overview bg-white rounded-lg shadow p-6">
    <h2 class="text-xl font-bold mb-4">Level Progress</h2>
    <div class="space-y-4">
      <ProgressBar
        :value="progress.completed_lessons"
        :max="progress.total_lessons"
        class="mb-2"
      />

      <div class="flex justify-between text-sm text-gray-600">
        <span>Lessons Completed: {{ progress.completed_lessons }}/{{ progress.total_lessons }}</span>
        <span>Points Earned: {{ progress.total_points }}</span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import ProgressBar from '@/components/lessons/common/ProgressBar.vue';
import type { LevelProgress } from '@/types/lessons';

const props = defineProps<{
  progress: LevelProgress;
}>();
</script>
