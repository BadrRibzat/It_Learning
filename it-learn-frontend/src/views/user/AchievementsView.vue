<template>
  <div class="achievements-page container mx-auto px-4 py-8">
    <div v-if="loading" class="flex justify-center items-center min-h-[400px]">
      <LoadingSpinner />
    </div>
    
    <div v-else>
      <!-- Header Section -->
      <div class="mb-8">
        <h1 class="text-2xl font-bold text-gray-900">Achievements</h1>
        <p class="text-gray-600 mt-2">
          {{ completionText }}
        </p>
      </div>

      <!-- Achievement Categories -->
      <div class="space-y-8">
        <!-- Level Mastery -->
        <div class="achievement-category">
          <h2 class="text-xl font-semibold text-gray-800 mb-4">Level Mastery</h2>
          <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            <AchievementItem 
              v-for="achievement in achievements" 
              :key="achievement.id" 
              :achievement="achievement"
            />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { useToast } from 'vue-toastification';
import { useProfileStore } from '@/stores/profile';
import type { Achievement } from '@/types/profile';
import LoadingSpinner from '@/components/common/LoadingSpinner.vue';
import AchievementItem from '@/components/achievements/Achievement.vue';

const toast = useToast();
const profileStore = useProfileStore();

const loading = ref(true);
const error = ref<string | null>(null);
const achievements = ref<Achievement[]>([]);

// Achievement icons mapping
const achievementIcons = {
  beginner: '/src/assets/achievements/beginner-level-achievement.svg',
  intermediate: '/src/assets/achievements/intermediate-level-achievement.svg',
  advanced: '/src/assets/achievements/advanced-level-achievement.svg',
  expert: '/src/assets/achievements/expert-level-achievement.svg'
};

// Computed properties
const learningAchievements = computed(() => 
  achievements.value.filter(a => a.type === 'learning')
);

const levelAchievements = computed(() => 
  achievements.value.filter(a => a.type === 'level')
);

const completionText = computed(() => {
  const earned = achievements.value.filter(a => a.earned_at).length;
  const total = achievements.value.length;
  const percentage = Math.round((earned / total) * 100);
  return `You've earned ${earned} out of ${total} achievements (${percentage}% complete)`;
});

// Methods
const getAchievementIcon = (achievement: Achievement) => {
  const level = achievement.name.toLowerCase();
  return achievementIcons[level as keyof typeof achievementIcons] || achievementIcons.beginner;
};

const loadAchievements = async () => {
  try {
    loading.value = true;
    error.value = null;
    // Fix: Properly await the response and store it
    achievements.value = await profileStore.fetchAchievements();

    // If no achievements exist, initialize with default levels
    if (achievements.value.length === 0) {
      achievements.value = [
        {
          id: 'beginner',
          name: 'Beginner Level',
          description: 'Complete the beginner level lessons and test',
          icon: '/src/assets/achievements/beginner-level-achievement.svg',
          earned_at: null,
          type: 'level',
          progress: 0,
          required: 100
        },
        {
          id: 'intermediate',
          name: 'Intermediate Level',
          description: 'Master intermediate level concepts',
          icon: '/src/assets/achievements/intermediate-level-achievement.svg',
          earned_at: null,
          type: 'level',
          progress: 0,
          required: 100
        },
        {
          id: 'advanced',
          name: 'Advanced Level',
          description: 'Complete advanced level challenges',
          icon: '/src/assets/achievements/advanced-level-achievement.svg',
          earned_at: null,
          type: 'level',
          progress: 0,
          required: 100
        },
        {
          id: 'expert',
          name: 'Expert Level',
          description: 'Achieve expert status',
          icon: '/src/assets/achievements/expert-level-achievement.svg',
          earned_at: null,
          type: 'level',
          progress: 0,
          required: 100
        }
      ];
    }
  } catch (err) {
    error.value = 'Failed to load achievements';
    toast.error('Failed to load achievements');
  } finally {
    loading.value = false;
  }
};

onMounted(() => {
  loadAchievements();
});
</script>

<style scoped>
.achievement-category {
  @apply bg-white rounded-lg shadow-sm p-6;
}

.achievements-page {
  @apply bg-gray-50 min-h-screen;
}
</style>