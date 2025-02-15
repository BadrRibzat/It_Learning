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
      <div class="text-sm text-gray-600">
        {{ currentProgress.completed_lessons }}/{{ currentProgress.total_lessons }} Lessons
        ({{ currentProgress.total_points }} points)
      </div>
    </div>
    <ProgressBar
      :value="currentProgress.completed_lessons"
      :max="currentProgress.total_lessons"
      class="mb-2"
    />
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
import ProgressBar from '@/components/lessons/common/ProgressBar.vue';
import LevelList from '@/components/lessons/level/LevelList.vue';
import LoadingSpinner from '@/components/common/LoadingSpinner.vue';
import LearningDebugComponent from './LearningDebugComponent.vue';

const router = useRouter();
const store = useLessonsStore();
const loading = ref(true);
const error = ref<string | null>(null);

const currentLevel = computed(() => store.currentLevel);
const availableLevels = computed(() => store.levels);
const levelProgressMap = computed(() => store.levelProgressMap);
const currentProgress = computed(() => store.levelProgress || {
  completed_lessons: 0,
  total_lessons: 0,
});

const isDevelopment = computed(() => import.meta.env.MODE === 'development');
const debugData = computed(() => ({
  currentLevel: currentLevel.value,
  availableLevels: availableLevels.value,
  levelProgress: currentProgress.value,
}));

const initializeDashboard = async () => {
  try {
    loading.value = true;
    error.value = null;
    await store.getLevels();
    await store.getCurrentLevel();
  } catch (err) {
    error.value = err instanceof Error ? err.message : 'Failed to load dashboard';
  } finally {
    loading.value = false;
  }
};

const continueCurrentLevel = () => {
  if (currentLevel.value) {
    const nextLesson = store.lessons.find(
      (lesson) => !lesson.completed && lesson.progress.quiz_unlocked
    );

    if (nextLesson) {
      router.push({
        name: 'quiz',
        params: { levelId: currentLevel.value.id, lessonId: nextLesson.id },
      });
    } else {
      router.push({
        name: 'level',
        params: { levelId: currentLevel.value.id },
      });
    }
  }
};

const handleLevelSelect = async (level: Level) => {
  try {
    if (level.name.toLowerCase() === 'beginner') {
      // Direct access to beginner level
      router.push({
        name: 'level',
        params: { levelId: level.id }
      });
      return;
    }

    const access = await store.checkLevelAccess(level.id);
    
    if (access.requires_test) {
      router.push({
        name: 'level-test',
        params: { levelId: level.id }
      });
    } else if (access.has_access) {
      router.push({
        name: 'level',
        params: { levelId: level.id }
      });
    } else if (access.error) {
      toast.error(access.error);
    }
  } catch (error) {
    toast.error('Failed to access level');
  }
};

onMounted(() => {
  initializeDashboard();
});
</script>

<style scoped>
.learning-dashboard {
  max-width: 800px;
  margin: 0 auto;
}
</style>
