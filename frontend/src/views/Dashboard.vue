<template>
  <div class="container mx-auto p-4">
    <h1 class="text-3xl font-bold mb-4">Dashboard</h1>
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <div class="bg-white rounded-lg shadow-md p-6">
        <div class="flex items-center mb-4">
          <img :src="userProfilePicture" alt="Profile Picture" class="w-24 h-24 rounded-full mr-4">
          <div>
            <h2 class="text-xl font-bold">{{ userProfile.username || 'Loading...' }}</h2>
            <p class="text-gray-600">{{ userProfile.email || 'Loading...' }}</p>
          </div>
        </div>
        <h2 class="text-xl font-bold mb-4">Progress Overview</h2>
        <div v-if="userProgress" class="mb-4">
          <p class="text-gray-600">Current Level: {{ userProgress.current_level }}</p>
          <p class="text-gray-600">Total Points: {{ userProgress.total_points }}</p>
          <p class="text-gray-600">Lessons Completed: {{ userProgress.completed_lessons }}</p>
        </div>
        <div v-else>
          <p class="text-gray-600">Loading progress...</p>
        </div>
        <router-link
          to="/lessons"
          class="inline-block bg-primary text-white px-4 py-2 rounded-md hover:bg-primary-dark"
        >
          Continue Learning
        </router-link>
      </div>
      <div class="bg-white rounded-lg shadow-md p-6">
        <h2 class="text-xl font-bold mb-4">Recent Activity</h2>
        <ul class="space-y-2">
          <li v-for="activity in recentActivity" :key="activity.id" class="text-gray-600">
            {{ activity.description }}
          </li>
        </ul>
      </div>
      <div class="bg-white rounded-lg shadow-md p-6">
        <h2 class="text-xl font-bold mb-4">Recommended Lessons</h2>
        <ul class="space-y-2">
          <li v-for="lesson in recommendedLessons" :key="lesson.id">
            <router-link
              :to="{ name: 'LessonDetail', params: { levelId: lesson.level, lessonId: lesson.id } }"
              class="text-primary hover:underline"
            >
              {{ lesson.title }}
            </router-link>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue';
import { useStore } from 'vuex';

const store = useStore();

const userProfile = computed(() => store.getters['auth/currentUser'] || {});
const userProfilePicture = computed(() => userProfile.value?.profile_picture || '/default-profile.png');
const userProgress = computed(() => store.getters['progress/userProgress']);
const recentActivity = ref([]);
const recommendedLessons = ref([]);

onMounted(async () => {
  await store.dispatch('auth/fetchUserProfile');
  await fetchDashboardData();
});

const fetchDashboardData = async () => {
  try {
    await store.dispatch('progress/fetchUserProgress');
    recommendedLessons.value = await store.dispatch('lessons/fetchRecommendedLessons');
  } catch (error) {
    console.error('Failed to fetch dashboard data:', error);
  }
};
</script>
