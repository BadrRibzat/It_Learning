<template>
  <div class="learning-dashboard space-y-8">
    <!-- Current Level Progress -->
    <div class="bg-white rounded-lg shadow p-6">
      <div class="flex items-center justify-between mb-6">
        <h2 class="text-xl font-bold text-gray-900">Current Progress</h2>
        <span 
          v-if="levelProgress"
          class="text-sm text-gray-600"
        >
          Level {{ currentLevel?.order || 1 }} - {{ currentLevel?.name }}
        </span>
      </div>

      <div v-if="levelProgress" class="space-y-6">
        <ProgressBar
          :value="levelProgress.completed_lessons"
          :max="levelProgress.total_lessons"
          class="mb-4"
        />

        <div class="grid grid-cols-3 gap-4">
          <QuickStat
            title="Lessons Completed"
            label="Lessons Completed"
            :value="levelProgress.completed_lessons"
            :total="levelProgress.total_lessons"
            icon="BookOpenIcon"
          />
          <QuickStat
            title="Quiz Score Average"
            label="Quiz Score Average"
            :value="averageQuizScore"
            suffix="%"
            icon="AcademicCapIcon"
          />
          <QuickStat
            title="Points Earned"
            label="Points Earned"
            :value="levelProgress.total_points"
            icon="StarIcon"
          />
        </div>

        <div class="flex justify-end">
          <button
            v-if="canTakeLevelTest"
            @click="showLevelTest = true"
            class="px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700"
          >
            Take Level Test
          </button>
        </div>
      </div>

      <div v-else class="text-center py-8 text-gray-500">
        Start learning to track your progress
      </div>
    </div>

    <!-- Overall Progress -->
    <div class="bg-white rounded-lg shadow p-6">
      <h2 class="text-xl font-bold text-gray-900 mb-6">Overall Progress</h2>
      <div class="grid grid-cols-2 gap-4">
        <QuickStat
          title="Total Points"
          label="Total Points Earned"
          :value="totalPoints"
          icon="StarIcon"
        />
        <QuickStat
          title="Lessons Completed"
          label="Total Lessons Completed"
          :value="totalLessonsCompleted"
          icon="BookOpenIcon"
        />
      </div>
    </div>

    <!-- Available Levels -->
    <div class="space-y-6">
      <div class="flex items-center justify-between">
        <h2 class="text-xl font-bold text-gray-900">Available Levels</h2>
        <div class="flex items-center space-x-2 text-sm text-gray-600">
          <span class="flex items-center">
            <div class="w-3 h-3 rounded-full bg-primary-100 mr-2"></div>
            Current
          </span>
          <span class="flex items-center">
            <div class="w-3 h-3 rounded-full bg-green-100 mr-2"></div>
            Available
          </span>
          <span class="flex items-center">
            <div class="w-3 h-3 rounded-full bg-gray-100 mr-2"></div>
            Locked
          </span>
        </div>
      </div>

      <LevelList
        :levels="availableLevels"
        :progress="levelProgressMap"
        @select-level="handleLevelSelect"
      />
    </div>

    <!-- Level Test Modal -->
    <LevelTestModal
      v-if="showLevelTest"
      :level="currentLevel"
      @close="showLevelTest = false"
      @start-test="navigateToTest"
    />

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

const router = useRouter();
const lessonsStore = useLessonsStore();
const showLevelTest = ref(false);

const currentLevel = computed(() => lessonsStore.currentLevel);
const availableLevels = computed(() => lessonsStore.availableLevels);
const levelProgress = computed(() => lessonsStore.levelProgress);
const canTakeLevelTest = computed(() => lessonsStore.canTakeLevelTest);
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
  const sum = levelProgress.value.quiz_scores.reduce((a, b) => a + b, 0);
  return Math.round(sum / levelProgress.value.quiz_scores.length);
});

onMounted(async () => {
  try {
    await Promise.all([
      lessonsStore.fetchLevels(),
      lessonsStore.fetchCurrentLevel()
    ]);

    // Fetch level progress for all available levels
    if (availableLevels.value) {
      await Promise.all(availableLevels.value.map(async (level) => {
        try {
          const progress = await lessonsStore.fetchLevelProgress(level.id);
          if (lessonsStore.levelProgress) {
            levelProgressMap.value[level.id] = lessonsStore.levelProgress;
          }
        } catch (error) {
          console.error(`Failed to fetch level progress for level ${level.id}:`, error);
        }
      }));
    }

    if (currentLevel.value) {
      await lessonsStore.fetchLevelProgress(currentLevel.value.id);
    }
  } catch (error) {
    console.error('Error initializing learning dashboard:', error);
  }
});

const handleLevelSelect = (level: Level) => {
  router.push({ 
    name: 'level', 
    params: { levelId: level.id }
  });
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
</script>
