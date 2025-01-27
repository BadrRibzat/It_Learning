<template>
  <div class="space-y-8">
    <!-- Level Progress Overview -->
    <LevelProgressComponent />

    <!-- Current Level Content -->
    <div class="bg-white rounded-lg shadow-lg p-6">
      <div class="flex justify-between items-center mb-6">
        <div>
          <h2 class="text-2xl font-bold text-gray-900 capitalize">
            {{ currentLevel }} Level
          </h2>
          <p class="text-gray-600 mt-1">
            Master these lessons to advance to the next level
          </p>
        </div>

        <!-- Level Test Button (if eligible) -->
        <button
          v-if="showLevelTest"
          @click="goToLevelTest"
          class="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary-dark"
        >
          Take Level Test
        </button>
      </div>

      <!-- Lessons Grid -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div
          v-for="lesson in levelLessons"
          :key="lesson._id"
          class="bg-gray-50 rounded-lg p-6 border border-gray-200"
        >
          <div class="flex justify-between items-start mb-4">
            <h3 class="text-lg font-semibold text-gray-900">
              {{ lesson.title }}
            </h3>
            <span
              :class="[
                'px-2 py-1 rounded-full text-xs font-medium',
                getStatusClasses(lesson)
              ]"
            >
              {{ getLessonStatus(lesson) }}
            </span>
          </div>

          <!-- Progress Bar -->
          <div class="mb-4">
            <div class="flex justify-between text-sm text-gray-600 mb-1">
              <span>Progress</span>
              <span>{{ lesson.progress?.completed_flashcards || 0 }}/{{ lesson.total_flashcards }}</span>
            </div>
            <div class="w-full bg-gray-200 rounded-full h-2">
              <div
                class="bg-primary h-2 rounded-full transition-all duration-300"
                :style="{
                  width: `${(lesson.progress?.completed_flashcards || 0) / lesson.total_flashcards * 100}%`
                }"
              ></div>
            </div>
          </div>

          <!-- Action Buttons -->
          <div class="space-y-2">
            <router-link
              :to="`/profile/lessons/${currentLevel}/flashcards?lesson=${lesson._id}`"
              class="block w-full px-4 py-2 bg-primary text-white rounded-md text-center hover:bg-primary-dark transition-colors"
            >
              {{ lesson.progress?.completed_flashcards ? 'Continue Practice' : 'Start Learning' }}
            </router-link>

            <router-link
              v-if="lesson.progress?.quiz_unlocked"
              :to="`/profile/lessons/${currentLevel}/quiz?lesson=${lesson._id}`"
              class="block w-full px-4 py-2 bg-green-600 text-white rounded-md text-center hover:bg-green-700 transition-colors"
            >
              Take Quiz
            </router-link>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, computed, onMounted } from 'vue';
import { useStore } from 'vuex';
import { useRouter, useRoute } from 'vue-router';
import LevelProgressComponent from './LevelProgressComponent.vue';
import { NotificationService } from '@/utils/NotificationService';

export default {
  name: 'LessonsComponent',
  
  components: {
    LevelProgressComponent
  },

  setup() {
    const store = useStore();
    const router = useRouter();
    const route = useRoute();
    
    const levelLessons = ref([]);
    const loading = ref(true);

    const currentLevel = computed(() => route.params.level || store.getters['lessons/currentLevel']);
    const showLevelTest = computed(() => {
      const level = currentLevel.value;
      return level !== 'beginner' && canTakeLevelTest.value;
    });

    const canTakeLevelTest = computed(() => {
      // Check if all lessons are completed and quizzes passed
      return levelLessons.value.every(lesson => 
        lesson.progress?.completed_flashcards === lesson.total_flashcards &&
        lesson.progress?.quiz_completed
      );
    });

    const fetchLessons = async () => {
      loading.value = true;
      try {
        const response = await store.dispatch('lessons/getLessonsByLevel', currentLevel.value);
        levelLessons.value = response;
      } catch (error) {
        NotificationService.showError('Failed to load lessons');
      } finally {
        loading.value = false;
      }
    };

    const getLessonStatus = (lesson) => {
      if (lesson.progress?.quiz_completed) return 'Completed';
      if (lesson.progress?.quiz_unlocked) return 'Quiz Ready';
      if (lesson.progress?.completed_flashcards > 0) return 'In Progress';
      return 'Not Started';
    };

    const getStatusClasses = (lesson) => {
      const status = getLessonStatus(lesson);
      const classes = {
        'Completed': 'bg-green-100 text-green-800',
        'Quiz Ready': 'bg-yellow-100 text-yellow-800',
        'In Progress': 'bg-blue-100 text-blue-800',
        'Not Started': 'bg-gray-100 text-gray-800'
      };
      return classes[status];
    };

    const goToLevelTest = () => {
      router.push(`/profile/lessons/${currentLevel.value}/test`);
    };

    onMounted(() => {
      fetchLessons();
    });

    return {
      currentLevel,
      levelLessons,
      loading,
      showLevelTest,
      getLessonStatus,
      getStatusClasses,
      goToLevelTest
    };
  }
};
</script>
