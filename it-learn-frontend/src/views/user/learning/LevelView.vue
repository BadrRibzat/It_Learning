<template>
  <div class="level-view space-y-8">
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

    <template v-else>
      <!-- Level Header -->
      <div class="bg-white rounded-lg shadow p-6">
        <div class="flex items-center justify-between">
          <div>
            <h2 class="text-xl font-bold text-gray-900">Level {{ currentLevel?.order }} - {{ currentLevel?.name }}</h2>
            <p class="text-gray-600 mt-1">{{ currentLevel?.description }}</p>
          </div>
        </div>
      </div>

      <div class="lesson-list space-y-4">
        <LessonCard
          v-for="lesson in lessons"
          :key="lesson.id"
          :lesson="lesson"
          :progress="lesson.progress || { completed: false, points: 0, total_points: 0 }"
          @select="handleLessonSelect"
          @start-lesson="handleStartLesson"
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
import { useRoute, useRouter } from 'vue-router';
import { useLessonsStore } from '@/stores/lessons';
import type { Lesson } from '@/types/lessons';
import type { RouteParams } from 'vue-router';
import LessonCard from '@/components/lessons/level/LessonCard.vue';
import LoadingSpinner from '@/components/common/LoadingSpinner.vue';
import LearningDebugComponent from './LearningDebugComponent.vue';

interface LevelRouteParams extends RouteParams {
  levelId: string;
}

const router = useRouter();
const route = useRoute();
const store = useLessonsStore();
const loading = ref(true);
const error = ref<string | null>(null);

const levelId = computed(() => (route.params as LevelRouteParams).levelId);
const currentLevel = computed(() => store.currentLevel);
const lessons = computed(() => store.lessons);
const isDevelopment = computed(() => import.meta.env.MODE === 'development');

const initializeLevel = async () => {
  try {
    loading.value = true;
    error.value = null;
    await store.getLessons(levelId.value);
  } catch (err) {
    error.value = err instanceof Error ? err.message : 'Failed to load level data';
  } finally {
    loading.value = false;
  }
};

const isLessonUnlocked = (lesson: Lesson) => {
  return true;
};

const handleLessonSelect = (lesson: Lesson) => {
  if (!isLessonUnlocked(lesson)) return;
};

const handleStartLesson = async (lesson: Lesson) => {
  try {
    console.log('Fetching flashcards for lesson:', lesson.id);
    await store.getFlashcards(lesson.id);
    router.push({
      name: 'flashcards',
      params: { levelId: levelId.value, lessonId: lesson.id },
    });
  } catch (error) {
    console.error('Failed to fetch flashcards:', error);
  }
};

const handleLevelAccess = async () => {
  await initializeLevel();
};

const debugData = computed(() => ({
  levelId: levelId.value,
  currentLevel: currentLevel.value,
  lessons: lessons.value,
  storeState: {
    loading: store.loading,
    error: store.error
  }
}));

onMounted(() => {
  handleLevelAccess();
});
</script>

<style scoped>
.level-view {
  max-width: 800px;
  margin: 0 auto;
}
</style>
