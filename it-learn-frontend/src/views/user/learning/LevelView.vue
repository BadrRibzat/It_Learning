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
          v-for="lesson in lessons"
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
    </template>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useLessonsStore } from '@/stores/lessons';
import type { Lesson } from '@/types/lessons';
import LessonCard from '@/components/lessons/level/LessonCard.vue';
import LevelTestModal from '@/components/lessons/level/LevelTestModal.vue';
import LoadingSpinner from '@/components/common/LoadingSpinner.vue';

const router = useRouter();
const route = useRoute();
const store = useLessonsStore();
const loading = ref(true);
const error = ref<string | null>(null);
const showLevelTest = ref(false);

const levelId = computed(() => route.params.levelId as string);
const currentLevel = computed(() => store.currentLevel);
const lessons = computed(() => store.lessons);
const canTakeLevelTest = computed(() => store.levelTest?.can_attempt);

const initializeLevel = async () => {
  try {
    loading.value = true;
    error.value = null;
    await store.getLessons(route.params['levelId'] as string);
    await store.getLevelTest(route.params['levelId'] as string);
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
  
  router.push({
    name: 'quiz',
    params: { levelId: levelId.value, lessonId: lesson.id },
  });
};

const navigateToTest = () => {
  router.push({
    name: 'level-test',
    params: { levelId: levelId.value },
  });
  showLevelTest.value = false;
};

const handleLevelAccess = async () => {
  const access = await store.checkLevelAccess(levelId.value);
  
  if (access.requires_test) {
    router.push({
      name: 'level-test',
      params: { levelId: levelId.value }
    });
  }
};

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
