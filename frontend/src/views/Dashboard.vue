<template>
  <div class="container mx-auto p-4">
    <h1 class="text-3xl font-bold mb-4">Dashboard</h1>
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <div class="bg-white rounded-lg shadow-md p-6">
        <h2 class="text-xl font-bold mb-4">Progress Overview</h2>
        <div class="mb-4">
          <p class="text-gray-600">Current Level: {{ userProgress.current_level || 1 }}</p>
          <p class="text-gray-600">Total Points: {{ userProgress.total_points || 0 }}</p>
          <p class="text-gray-600">Lessons Completed: {{ userProgress.completed_lessons || 0 }}</p>
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
import { ref, onMounted } from 'vue';
import { useStore } from 'vuex';

const store = useStore();

const userProgress = ref({});
const recentActivity = ref([]);
const recommendedLessons = ref([]);

onMounted(async () => {
  await fetchDashboardData();
});

const fetchDashboardData = async () => {
  try {
    userProgress.value = await store.dispatch('profile/fetchUserProgress');
    recommendedLessons.value = await store.dispatch('lessons/fetchRecommendedLessons');
    // For recent activity, we'll need to implement this endpoint in the backend
    // recentActivity.value = await store.dispatch('profile/fetchRecentActivity');
  } catch (error) {
    console.error('Failed to fetch dashboard data:', error);
  }
};
</script>
