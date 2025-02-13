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

      <div class="lesson-list space-y-4">
        <LessonCard
          v-for="lesson in lessonsStore.lessons"
          :key="lesson.id"
          :lesson="lesson"
          :isUnlocked="isLessonUnlocked(lesson)"
          @select="handleLessonSelect"
        />
      </div>

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
import LessonCard from '@/components/lessons/level/LessonCard.vue';
import LoadingSpinner from '@/components/common/LoadingSpinner.vue';
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

const handleLessonSelect = async (lesson: Lesson) => {
  if (!lesson.progress.quiz_unlocked) {
    router.push({
      name: 'flashcards',
      params: { levelId: levelId.value, lessonId: lesson.id }
    });
  } else if (!lesson.completed) {
    router.push({
      name: 'quiz',
      params: { levelId: levelId.value, lessonId: lesson.id }
    });
  } else {
    router.push(`/lessons/${lesson.id}`);
  }
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

<style scoped>
.level-view {
  max-width: 800px;
  margin: 0 auto;
}
</style>
