<template>
  <div class="learning-dashboard space-y-8">
    <div v-if="loading" class="flex justify-center items-center py-12">
      <LoadingSpinner />
    </div>

    <div v-else-if="error" class="text-center py-8">
      <p class="text-red-600">{{ error }}</p>
      <button 
        @click="initializeDashboard" 
        class="mt-4 px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700"
      >
        Retry
      </button>
    </div>

    <div v-else>
      <div class="max-w-3xl mx-auto">
        <!-- Available Levels -->
        <div class="level-list">
          <LevelList
            :levels="availableLevels"
            :levelProgressMap="levelProgressMap"
            @select-level="handleLevelSelect"
          />
        </div>
      </div>
      
      <!-- Debug Information -->
      <div v-if="isDevelopment" class="mt-8">
        <LearningDebugComponent :debug-data="debugData" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useLessonsStore } from '@/stores/lessons';
import type { Level } from '@/types/lessons';
import LevelList from '@/components/lessons/level/LevelList.vue';
import LoadingSpinner from '@/components/common/LoadingSpinner.vue';
import LearningDebugComponent from './LearningDebugComponent.vue';

const router = useRouter();
const store = useLessonsStore();
const loading = ref(true);
const error = ref<string | null>(null);

const availableLevels = computed(() => store.levels);
const levelProgressMap = computed(() => store.levelProgressMap);

const isDevelopment = computed(() => import.meta.env.MODE === 'development');

const initializeDashboard = async () => {
  try {
    loading.value = true;
    error.value = null;
    await store.getLevels();
  } catch (err) {
    error.value = err instanceof Error ? err.message : 'Failed to load dashboard';
  } finally {
    loading.value = false;
  }
};

const handleLevelSelect = async (level: Level) => {
  try {
    if (level.name.toLowerCase() === 'beginner') {
      // Direct access to the beginner level
      await store.getLessons(level.id);
      router.push({
        name: 'level',
        params: { levelId: level.id }
      });
      return;
    }
    router.push({
      name: 'level',
      params: { levelId: level.id }
    });
  } catch (error) {
    console.error('Failed to access level');
  }
};

const debugData = computed(() => ({
  availableLevels: availableLevels.value,
  levelProgressMap: levelProgressMap.value,
  storeState: {
    loading: store.loading,
    error: store.error
  }
}));

onMounted(() => {
  initializeDashboard();
});
</script>

<style scoped>
.learning-dashboard {
  max-width: 800px;
  margin: 0 auto;
  padding: 1rem;
}
</style>
