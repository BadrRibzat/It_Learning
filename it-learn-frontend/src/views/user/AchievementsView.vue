<template>
  <div class="achievements-page container mx-auto px-4 py-8">
    <div v-if="loading" class="flex justify-center items-center min-h-screen">
      <LoadingSpinner />
    </div>

    <div v-else class="space-y-8">
      <!-- Achievements Header -->
      <div class="bg-white rounded-lg shadow p-6">
        <h1 class="text-2xl font-bold text-gray-900">Your Achievements</h1>
        <p class="text-gray-600 mt-2">
          Track your progress and unlock new achievements as you learn
        </p>
        <div class="mt-4 flex items-center space-x-4">
          <div class="text-primary-600">
            <span class="text-3xl font-bold">{{ totalAchievements }}</span>
            <span class="text-sm ml-2">Achievements Earned</span>
          </div>
          <div class="text-gray-600">
            <span class="text-3xl font-bold">{{ completionRate }}%</span>
            <span class="text-sm ml-2">Completion Rate</span>
          </div>
        </div>
      </div>

      <!-- Achievement Categories -->
      <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div 
          v-for="category in achievementCategories" 
          :key="category.id"
          class="bg-white rounded-lg shadow p-6"
        >
          <h2 class="text-xl font-semibold text-gray-900 mb-4">
            {{ category.name }}
          </h2>
          <div class="space-y-4">
            <Achievement
              v-for="achievement in category.achievements"
              :key="achievement.id"
              :achievement="achievement"
              :unlocked="unlockedAchievements.includes(achievement.id)"
            />
          </div>
        </div>
      </div>

      <!-- Recent Unlocks -->
      <div class="bg-white rounded-lg shadow p-6">
        <h2 class="text-xl font-semibold text-gray-900 mb-4">
          Recently Unlocked
        </h2>
        <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Achievement
            v-for="achievement in recentUnlocks"
            :key="achievement.id"
            :achievement="achievement"
            :unlocked="true"
            :show-date="true"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { useProfileStore } from '@/stores/profile';
import type { Achievement as AchievementType } from '@/types/profile';
import LoadingSpinner from '@/components/common/LoadingSpinner.vue';
import Achievement from '@/components/achievements/Achievement.vue';

const profileStore = useProfileStore();
const loading = ref(true);
const achievements = ref<AchievementType[]>([]);
const unlockedAchievements = ref<string[]>([]);

const totalAchievements = computed(() => achievements.value.length);
const completionRate = computed(() => {
  if (!achievements.value.length) return 0;
  return Math.round((unlockedAchievements.value.length / achievements.value.length) * 100);
});

const recentUnlocks = computed(() => {
  return achievements.value
    .filter(a => unlockedAchievements.value.includes(a.id))
    .sort((a, b) => new Date(b.earned_at).getTime() - new Date(a.earned_at).getTime())
    .slice(0, 4);
});

const achievementCategories = computed(() => {
  // Group achievements by category
  const categories = achievements.value.reduce((acc, achievement) => {
    const category = acc.find(c => c.id === achievement.category_id);
    if (category) {
      category.achievements.push(achievement);
    } else {
      acc.push({
        id: achievement.category_id,
        name: achievement.category_name,
        achievements: [achievement]
      });
    }
    return acc;
  }, [] as any[]);

  return categories.sort((a, b) => a.name.localeCompare(b.name));
});

onMounted(async () => {
  try {
    await profileStore.fetchAchievements();
    achievements.value = profileStore.achievements;
    unlockedAchievements.value = profileStore.unlockedAchievements;
  } finally {
    loading.value = false;
  }
});
</script>
