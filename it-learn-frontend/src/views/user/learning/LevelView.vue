<template>
  <div class="level-view space-y-8">
    <!-- Loading and Error States -->
    <div v-if="loading" class="flex justify-center items-center py-12">
      <LoadingSpinner />
    </div>
    <div v-else-if="error" class="text-center py-8">
      <p class="text-red-600">{{ error }}</p>
      <button 
        @click="initializeLevel" 
        class="mt-4 px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700"
      >
        Retry
      </button>
    </div>

    <!-- Main Content -->
    <template v-else>
      <!-- Level Header -->
      <div class="bg-white rounded-lg shadow p-6">
        <div class="flex items-center justify-between">
          <div>
            <h2 class="text-xl font-bold text-gray-900">Level {{ currentLevel?.order }} - {{ currentLevel?.name }}</h2>
            <p class="text-gray-600 mt-1">{{ currentLevel?.description }}</p>
          </div>
          <div v-if="canTakeLevelTest">
            <button
              @click="showLevelTest = true"
              class="px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700"
            >
              Take Level Test
            </button>
          </div>
        </div>
      </div>

      <LevelList
        :levels="lessonsStore.levels"
        :progress="lessonsStore.levelProgress"
        @select-level="handleLevelSelect"
      />

      <LevelTestModal
        v-if="showLevelTest"
        :level="currentLevel"
        @close="showLevelTest = false"
        @start-test="navigateToTest"
      />

      <!-- Debug Information -->
      <div v-if="isDevelopment" class="mt-8">
        <LearningDebugComponent :debug-data="debugData" />
      </div>
    </template>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { useLessonsStore } from '@/stores/lessons';
import {
  ArrowLeftIcon,
  ClipboardIcon,
  ClockIcon,
  ChartBarIcon
} from '@heroicons/vue/24/outline';
import type { Lesson } from '@/types/lessons';

import LoadingSpinner from '@/components/common/LoadingSpinner.vue';
import LessonCard from '@/components/lessons/level/LessonCard.vue';
import LevelTestModal from '@/components/lessons/level/LevelTestModal.vue';
import LearningDebugComponent from './LearningDebugComponent.vue';

const router = useRouter();
const route = useRoute();

const loading = ref(true);
const error = ref<string | null>(null);
const showLevelTest = ref(false);

const isDevelopment = computed(() => import.meta.env.MODE === 'development');
const levelId = computed(() => route.params['levelId'] as string);
const lessonsStore = useLessonsStore();
const currentLevel = computed(() => lessonsStore.currentLevel);
const lessons = computed(() => lessonsStore.lessons);
const canTakeLevelTest = computed(() => lessonsStore.canTakeLevelTest);

const debugData = computed(() => ({
  levelId: levelId.value,
  currentLevel: currentLevel.value,
  lessons: lessons.value,
  canTakeLevelTest: canTakeLevelTest.value,
  storeState: {
    loading: lessonsStore.loading,
    error: lessonsStore.error
  }
}));

const isLessonUnlocked = (lesson: Lesson) => {
  if (lesson.order === 1) return true;
  const previousLesson = lessons.value.find((l: Lesson) => l.order === lesson.order - 1);
  return previousLesson?.completed || false;
};

const initializeLevel = async () => {
  try {
    loading.value = true;
    error.value = null;

    await Promise.all([
      lessonsStore.getLessons(levelId.value),
      lessonsStore.getLevelProgress(levelId.value)
    ]);
  } catch (err) {
    error.value = err instanceof Error ? err.message : 'Failed to load level data';
  } finally {
    loading.value = false;
  }
};

const handleLessonSelect = (lesson: Lesson) => {
  const currentLevelOrder = lessonsStore.currentLevel?.order || 1;
  const selectedLevelOrder = currentLevel.value?.order || 1;

  let nextLevelId: string | null = null;

  switch (lessonsStore.currentLevel?.name) {
    case 'beginner':
      nextLevelId = '67ab4b56bd71099b79f6ca87'; // Intermediate
      break;
    case 'intermediate':
      nextLevelId = '67ab4b57bd71099b79f6ca88'; // Advanced
      break;
    case 'advanced':
      nextLevelId = '67ab4b57bd71099b79f6ca89'; // Expert
      break;
    default:
      nextLevelId = null;
  }

  if (selectedLevelOrder > currentLevelOrder && nextLevelId) {
    router.push({
      name: 'level-test',
      params: { levelId: nextLevelId }
    });
    return;
  }

  router.push({
    name: lesson.progress.quiz_unlocked ? 'quiz' : 'flashcards',
    params: {
      levelId: levelId.value,
      lessonId: lesson.id
    }
  });
};

const navigateToTest = () => {
  router.push({
    name: 'level-test',
    params: { levelId: levelId.value }
  });
  showLevelTest.value = false;
};

onMounted(() => {
  initializeLevel();
});
</script>
