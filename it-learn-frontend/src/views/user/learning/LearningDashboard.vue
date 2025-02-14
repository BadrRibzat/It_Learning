<template>
  <div class="learning-dashboard space-y-8">
    <div v-if="loading" class="flex justify-center items-center py-12">
      <LoadingSpinner />
    </div>

    <div v-else-if="error" class="text-center py-8">
      <p class="text-red-600">{{ error }}</p>
      <button 
        @click="initializeDashboard" 
        class="mt-4 px-4 py-2 bg-primary-600 text-white rounded-md"
      >
        Retry
      </button>
    </div>

    <template v-else>
      <!-- Current Level Progress -->
      <div v-if="currentLevel" class="bg-white rounded-lg shadow p-6">
        <div class="flex justify-between items-center mb-6">
          <h2 class="text-xl font-bold">Current Level: {{ currentLevel.name }}</h2>
          <button
            v-if="currentLevel"
            @click="continueCurrentLevel"
            class="px-4 py-2 bg-primary-600 text-white rounded-md"
          >
            Continue Learning
          </button>
        </div>
        <!-- ... progress indicators -->
      </div>

      <!-- Available Levels -->
      <div class="space-y-6">
        <h2 class="text-xl font-bold">Available Levels</h2>
        <LevelList
          :levels="availableLevels"
          :progress="levelProgressMap"
          @select-level="handleLevelSelect"
        />
      </div>
    </template>
    <!-- Debug Information -->
    <div v-if="isDevelopment" class="mt-8">
      <LearningDebugComponent :debug-data="debugData" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useLessonsStore } from '@/stores/lessons';
import { 
    StarIcon, 
    BookOpenIcon, 
    AcademicCapIcon,
    ClipboardIcon,
    ClockIcon,
    ChartBarIcon
} from '@heroicons/vue/24/outline';
import type { Level, LevelProgress } from '@/types/lessons';

import ProgressBar from '@/components/lessons/common/ProgressBar.vue';
import QuickStat from '@/components/profile/QuickStat.vue';
import LevelList from '@/components/lessons/level/LevelList.vue';
import LevelTestModal from '@/components/lessons/level/LevelTestModal.vue';
import LoadingSpinner from '@/components/common/LoadingSpinner.vue';
import LearningDebugComponent from './LearningDebugComponent.vue';

const router = useRouter();
const store = useLessonsStore(); // Use the store
const showLevelTest = ref(false);
const loading = ref(true);
const error = ref<string | null>(null);

const currentLevel = computed(() => store.currentLevel);
const availableLevels = computed(() => Array.isArray(store.levels) ? store.levels : []);
const levelProgress = computed(() => store.levelProgress);
const canTakeLevelTest = computed(() => store.levelTest);
const levelProgressMap = ref<{[levelId: string]: LevelProgress}>({});

const totalPoints = computed(() => {
  let total = 0;
  for (const levelId in levelProgressMap.value) {
    total += levelProgressMap.value[levelId]?.total_points || 0;
  }
  return total;
});

const totalLessonsCompleted = computed(() => {
  let total = 0;
  for (const levelId in levelProgressMap.value) {
    total += levelProgressMap.value[levelId]?.completed_lessons || 0;
  }
  return total;
});

const averageQuizScore = computed(() => {
  if (!levelProgress.value?.quiz_scores.length) return 0;
  const sum = levelProgress.value.quiz_scores.reduce((a: number, b: number) => a + b, 0);
  return Math.round(sum / levelProgress.value.quiz_scores.length);
});

const isDevelopment = computed(() => import.meta.env.MODE === 'development');
const debugData = computed(() => ({
  currentLevel: currentLevel.value,
  availableLevels: availableLevels.value,
  levelProgress: levelProgress.value,
  canTakeLevelTest: canTakeLevelTest.value,
  levelProgressMap: levelProgressMap.value,
  totalPoints: totalPoints.value,
  totalLessonsCompleted: totalLessonsCompleted.value,
  averageQuizScore: averageQuizScore.value,
}));

const initializeDashboard = async () => {
  try {
    loading.value = true;
    error.value = null;
    
    await store.getLevels();
    await store.getCurrentLevel();
    await store.unlockAllLessonsForBeginnerLevel(); // Unlock all lessons for beginner level

    if (availableLevels.value.length > 0) {
      await Promise.all(availableLevels.value.map(async (level) => {
        try {
          await store.getLevelProgress(level.id);
          if (store.levelProgress) {
            levelProgressMap.value[level.id] = store.levelProgress;
          }
        } catch (error) {
          console.error(`Failed to fetch level progress for level ${level.id}:`, error);
        }
      }));
    }

    if (currentLevel.value) {
      await store.getLevelProgress(currentLevel.value.id);
    }
  } catch (err) {
    error.value = err instanceof Error ? err.message : 'Failed to load dashboard';
  } finally {
    loading.value = false;
  }
};

onMounted(() => {
  initializeDashboard();
});

const handleLevelSelect = async (level: Level) => {
  if (level.order > (currentLevel.value?.order || 1)) {
    const redirectUrl = await store.redirectToLevelTest(level.id);
    if (redirectUrl) {
      router.push(redirectUrl);
    } else {
      router.push({
        name: 'level',
        params: { levelId: level.id }
      });
    }
  } else {
    router.push({
      name: 'level',
      params: { levelId: level.id }
    });
  }
};

const navigateToTest = () => {
  if (currentLevel.value) {
    router.push({
      name: 'level-test',
      params: { levelId: currentLevel.value.id }
    });
    showLevelTest.value = false;
  }
};

const continueCurrentLevel = () => {
  if (currentLevel.value) {
    router.push({
      name: 'level',
      params: { levelId: currentLevel.value.id }
    });
  }
};
</script>

<style scoped>
.learning-dashboard {
  max-width: 800px;
  margin: 0 auto;
}
</style>
