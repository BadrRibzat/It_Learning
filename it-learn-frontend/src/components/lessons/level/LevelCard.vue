<template>
  <div 
    class="level-card bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300"
    :class="{ 'opacity-75 cursor-not-allowed': !level.is_unlocked }"
  >
    <div class="p-6">
      <div class="flex items-center justify-between mb-4">
        <h3 class="text-lg font-semibold text-gray-900">
          {{ level.name }}
        </h3>
        <span 
          class="px-3 py-1 text-sm rounded-full"
          :class="statusClass"
        >
          {{ statusText }}
        </span>
      </div>
      
      <div class="space-y-4">
        <ProgressBar 
          v-if="progress"
          :value="progress.completed_lessons"
          :max="progress.total_lessons"
          class="mb-2"
        />
        
        <div class="flex items-center justify-between text-sm text-gray-600">
          <span>{{ progress?.completed_lessons || 0 }}/{{ progress?.total_lessons || 0 }} Lessons</span>
          <span>{{ progress?.total_points || 0 }} Points</span>
        </div>

        <button
          @click="handleLevelSelect"
          class="w-full px-4 py-2 text-sm font-medium rounded-md transition-colors"
          :class="buttonClass"
          :disabled="!level.is_unlocked"
        >
          {{ buttonText }}
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import type { Level, LevelProgress } from '@/types/lessons';
import ProgressBar from '@/components/lessons/common/ProgressBar.vue';

const props = defineProps<{
  level: Level;
  progress?: LevelProgress;
}>();

const emit = defineEmits<{
  (e: 'select', level: Level): void;
}>();

const statusClass = computed(() => {
  if (!props.level.is_unlocked) return 'bg-gray-100 text-gray-600';
  if (props.level.is_current) return 'bg-primary-100 text-primary-600';
  return 'bg-green-100 text-green-600';
});

const statusText = computed(() => {
  if (!props.level.is_unlocked) return 'Locked';
  if (props.level.is_current) return 'Current';
  return 'Available';
});

const buttonClass = computed(() => {
  if (!props.level.is_unlocked) {
    return 'bg-gray-100 text-gray-400 cursor-not-allowed';
  }
  return 'bg-primary-600 text-white hover:bg-primary-700';
});

const buttonText = computed(() => {
  if (!props.level.is_unlocked) return 'Locked';
  if (props.level.is_current) return 'Continue';
  return 'Start Level';
});

const handleLevelSelect = () => {
  if (props.level.is_unlocked) {
    emit('select', props.level);
  }
};
</script>
