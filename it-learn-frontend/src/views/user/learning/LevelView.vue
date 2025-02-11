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
        <div class="flex items-center justify-between mb-6">
          <div>
            <h1 class="text-2xl font-bold text-gray-900">
              Level {{ currentLevel?.order }}: {{ currentLevel?.name }}
            </h1>
            <p class="text-gray-600 mt-1">
              Complete all lessons and pass the level test to advance
            </p>
          </div>
          <div class="flex items-center space-x-4">
            <router-link 
              to="/profile/learning"
              class="text-gray-600 hover:text-gray-900"
            >
              <ArrowLeftIcon class="w-6 h-6" />
            </router-link>
            <button
              v-if="canTakeLevelTest"
              @click="showLevelTest = true"
              class="px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700"
            >
              Take Level Test
            </button>
          </div>
        </div>

        <!-- Level Progress -->
        <div class="grid grid-cols-3 gap-6 mb-6">
          <QuickStat
            label="Lessons Completed"
            title="Lessons Completed"
            :value="levelProgress?.completed_lessons || 0"
            :total="levelProgress?.total_lessons || 0"
            icon="BookOpenIcon"
          />
          <QuickStat
            label="Total Points"
            title="Total Points"
            :value="levelProgress?.total_points || 0"
            icon="StarIcon"
          />
          <QuickStat
            label="Average Score"
            title="Average Score"
            :value="averageQuizScore"
            suffix="%"
            icon="AcademicCapIcon"
          />
        </div>

        <ProgressBar
          :value="levelProgress?.completed_lessons || 0"
          :max="levelProgress?.total_lessons || 0"
          class="mt-4"
        />
      </div>

      <!-- Lessons Grid -->
      <div class="space-y-6">
        <h2 class="text-xl font-bold text-gray-900">Lessons</h2>
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <LessonCard
            v-for="lesson in lessons"
            :key="lesson.id"
            :lesson="lesson"
            :is-unlocked="isLessonUnlocked(lesson)"
            @select="handleLessonSelect"
          />
        </div>
      </div>

      <!-- Level Test Modal -->
      <LevelTestModal
        v-if="showLevelTest"
        :level="currentLevel"
        @close="showLevelTest = false"
        @start-test="navigateToTest"
      />
    </template>

    <!-- Debug Information -->
    <div v-if="isDevelopment" class="mt-8">
      <LearningDebugComponent :debug-data="debugData" />
    </div>
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
import ProgressBar from '@/components/lessons/common/ProgressBar.vue';
import QuickStat from '@/components/profile/QuickStat.vue';
import LessonCard from '@/components/lessons/level/LessonCard.vue';
import LevelTestModal from '@/components/lessons/level/LevelTestModal.vue';
import LearningDebugComponent from './LearningDebugComponent.vue';

const router = useRouter();
const route = useRoute();
const lessonsStore = useLessonsStore();

const loading = ref(true);
const error = ref<string | null>(null);
const showLevelTest = ref(false);

const isDevelopment = computed(() => import.meta.env.MODE === 'development');
const levelId = computed(() => route.params.levelId as string);
const currentLevel = computed(() => lessonsStore.currentLevel);
const lessons = computed(() => lessonsStore.lessons);
const levelProgress = computed(() => lessonsStore.levelProgress);
const canTakeLevelTest = computed(() => lessonsStore.canTakeLevelTest);

const debugData = computed(() => ({
  levelId: levelId.value,
  currentLevel: currentLevel.value,
  lessons: lessons.value,
  levelProgress: levelProgress.value,
  canTakeLevelTest: canTakeLevelTest.value,
  storeState: {
    loading: lessonsStore.loading,
    error: lessonsStore.error
  }
}));

const averageQuizScore = computed(() => {
  if (!levelProgress.value?.quiz_scores.length) return 0;
  const sum = levelProgress.value.quiz_scores.reduce((a, b) => a + b, 0);
  return Math.round(sum / levelProgress.value.quiz_scores.length);
});

const isLessonUnlocked = (lesson: Lesson) => {
  if (lesson.order === 1) return true;
  const previousLesson = lessons.value.find(l => l.order === lesson.order - 1);
  return previousLesson?.completed || false;
};

const initializeLevel = async () => {
  try {
    loading.value = true;
    error.value = null;
    
    await Promise.all([
      lessonsStore.fetchLessons(levelId.value),
      lessonsStore.fetchLevelProgress(levelId.value)
    ]);
  } catch (err) {
    error.value = err instanceof Error ? err.message : 'Failed to load level data';
  } finally {
    loading.value = false;
  }
};

const handleLessonSelect = (lesson: Lesson) => {
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
