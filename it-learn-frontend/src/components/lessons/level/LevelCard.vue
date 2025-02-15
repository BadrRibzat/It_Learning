<template>
  <div 
    class="level-card bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300"
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
        >
          {{ buttonText }}
        </button>

        <p v-if="level.test_available && !level.is_unlocked" class="text-sm text-gray-600">
          Pass the level test to unlock content
        </p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useRouter } from 'vue-router';
import { useLessonsStore } from '@/stores/lessons';
import type { Level, LevelProgress } from '@/types/lessons';
import ProgressBar from '@/components/lessons/common/ProgressBar.vue';

const props = defineProps<{
  level: Level;
  progress?: LevelProgress;
}>();

const router = useRouter();
const store = useLessonsStore();

const statusClass = computed(() => {
  if (props.level.name.toLowerCase() === 'beginner') return 'bg-primary-100 text-primary-600';
  if (!props.level.is_unlocked) return 'bg-gray-100 text-gray-600';
  return 'bg-green-100 text-green-600';
});

const statusText = computed(() => {
  if (props.level.name.toLowerCase() === 'beginner') return 'Available';
  return 'Available (Test Required)';
});

const buttonClass = computed(() => {
  if (props.level.name.toLowerCase() === 'beginner' || props.level.is_unlocked) {
    return 'bg-primary-600 text-white hover:bg-primary-700';
  }
  return 'bg-secondary-600 text-white hover:bg-secondary-700';
});

const buttonText = computed(() => {
  if (props.level.name.toLowerCase() === 'beginner') return 'Start Level';
  return 'Start Level';
});

const handleLevelSelect = async () => {
  const access = await store.checkLevelAccess(props.level.id);
  
  if (access.requires_test) {
    // Redirect to test if not submitted or score < 80%
    router.push({
      name: 'level-test',
      params: { levelId: props.level.id }
    });
  } else {
    // Otherwise go to level content
    router.push({
      name: 'level',
      params: { levelId: props.level.id }
    });
  }
};
</script>

<style scoped>
.level-card {
  transition: transform 0.3s;
}
.level-card:hover {
  transform: translateY(-5px);
}
</style>
