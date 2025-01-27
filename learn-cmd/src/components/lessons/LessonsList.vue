<template>
  <div class="space-y-6">
    <div v-if="loading" class="text-center py-8">
      <p>Loading lessons...</p>
    </div>

    <template v-else>
      <div v-for="lesson in levelLessons" :key="lesson._id" class="bg-white rounded-lg shadow-md p-6">
        <div class="flex justify-between items-center">
          <div>
            <h3 class="text-lg font-semibold text-gray-900">{{ lesson.title }}</h3>
            <p class="text-sm text-gray-500 mt-1">
              {{ getProgressText(lesson) }}
            </p>
          </div>

          <div class="flex items-center space-x-4">
            <!-- Flashcards Button -->
            <router-link
              :to="`/profile/lessons/${level}/flashcards?lesson=${lesson._id}`"
              class="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary-dark transition-colors"
            >
              Practice Flashcards
            </router-link>

            <!-- Quiz Button (if unlocked) -->
            <router-link
              v-if="isQuizUnlocked(lesson)"
              :to="`/profile/lessons/${level}/quiz?lesson=${lesson._id}`"
              class="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
            >
              Take Quiz
            </router-link>
          </div>
        </div>

        <!-- Progress Bar -->
        <div class="mt-4">
          <div class="w-full bg-gray-200 rounded-full h-2">
            <div
              class="bg-primary h-2 rounded-full transition-all duration-300"
              :style="{
                width: `${getProgressPercentage(lesson)}%`
              }"
            ></div>
          </div>
        </div>
      </div>

      <!-- Level Test Button (if available) -->
      <div v-if="canTakeLevelTest" class="text-center mt-8">
        <router-link
          :to="`/profile/lessons/${level}/test`"
          class="inline-block px-6 py-3 bg-primary text-white rounded-md hover:bg-primary-dark transition-colors"
        >
          Take Level Test
        </router-link>
      </div>
    </template>
  </div>
</template>

<script>
import { ref, onMounted, computed } from 'vue';
import { useStore } from 'vuex';
import { NotificationService } from '@/utils/NotificationService';

export default {
  name: 'LessonsList',
  props: {
    level: {
      type: String,
      required: true
    }
  },
  setup(props) {
    const store = useStore();
    const loading = ref(true);
    const levelLessons = ref([]);

    const canTakeLevelTest = computed(() => {
      return store.getters['lessons/canTakeLevelTest'](props.level);
    });

    const fetchLessons = async () => {
      try {
        const response = await store.dispatch('lessons/getLessonsByLevel', props.level);
        levelLessons.value = response;
      } catch (error) {
        NotificationService.showError('Failed to load lessons');
      } finally {
        loading.value = false;
      }
    };

    const getProgressPercentage = (lesson) => {
      const progress = lesson.progress || {};
      return Math.round((progress.completed_flashcards / progress.total_flashcards) * 100) || 0;
    };

    const getProgressText = (lesson) => {
      const progress = lesson.progress || {};
      return `${progress.completed_flashcards || 0}/${progress.total_flashcards || 10} Flashcards Completed`;
    };

    const isQuizUnlocked = (lesson) => {
      return lesson.progress?.quiz_unlocked || false;
    };

    onMounted(fetchLessons);

    return {
      loading,
      levelLessons,
      canTakeLevelTest,
      getProgressPercentage,
      getProgressText,
      isQuizUnlocked
    };
  }
};
</script>
