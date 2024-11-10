<template>
  <div class="min-h-screen bg-gray-100">
    <Sidebar />
    <div class="ml-64 p-8">
      <h1 class="text-3xl font-bold mb-8">Lessons</h1>
      
      <!-- Level Selection -->
      <div class="mb-6">
        <select 
          v-model="selectedLevel"
          @change="fetchLessonsForLevel"
          class="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm rounded-md"
        >
          <option value="">All Levels</option>
          <option v-for="level in levels" :key="level.id" :value="level.id">
            {{ level.name }}
          </option>
        </select>
      </div>

      <div v-if="loading" class="flex justify-center items-center h-64">
        <div class="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-primary"></div>
      </div>

      <div v-else-if="error" class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
        {{ error }}
      </div>

      <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        <LessonCard 
          v-for="lesson in filteredLessons" 
          :key="lesson.id" 
          :lesson="lesson" 
        />
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue';
import { useRouter } from 'vue-router';
import { useStore } from 'vuex';
import Sidebar from '@/components/dashboard/Sidebar.vue';
import LessonCard from '@/components/lessons/LessonCard.vue';

const route = useRouter();
const store = useStore();
const loading = ref(false);
const error = ref(null);
const selectedLevel = ref(route.query.level || '');
const lessons = ref([]);
const levels = ref([]);

const fetchLessonsForLevel = async () => {
  try {
    loading.value = true;
    error.value = null;
    const response = await store.dispatch('lessons/fetchLessons', selectedLevel.value);
    lessons.value = response.data || [];
    console.log('Fetched lessons:', lessons.value); // Debugging statement
  } catch (err) {
    error.value = 'Failed to fetch lessons. Please try again.';
    console.error('Failed to fetch lessons:', err);
  } finally {
    loading.value = false;
  }
};

const filteredLessons = computed(() => {
  if (selectedLevel.value) {
    return lessons.value.filter(lesson => lesson.level === parseInt(selectedLevel.value));
  }
  return lessons.value;
});

onMounted(async () => {
  try {
    loading.value = true;
    await store.dispatch('levels/fetchLevels');
    levels.value = store.state.levels.levels || [];
    console.log('Fetched levels:', levels.value); // Debugging statement

    if (route.query.level) {
      selectedLevel.value = route.query.level;
    }

    await fetchLessonsForLevel();
  } catch (err) {
    error.value = 'Failed to initialize lessons view. Please try again.';
    console.error('Error in lessons view:', err);
  } finally {
    loading.value = false;
  }
});
</script>
