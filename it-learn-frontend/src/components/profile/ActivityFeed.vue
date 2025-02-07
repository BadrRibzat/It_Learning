<template>
  <div class="bg-white rounded-lg shadow p-6">
    <h2 class="text-xl font-semibold mb-6">Recent Activities</h2>

    <div class="space-y-6">
      <div
        v-for="activity in activities"
        :key="activity.id"
        class="flex items-start space-x-4"
      >
        <!-- Activity Icon -->
        <div class="flex-shrink-0">
          <div :class="getActivityIconClass(activity.type)">
            <component
              :is="getActivityIcon(activity.type)"
              class="w-5 h-5"
            />
          </div>
        </div>

        <!-- Activity Content -->
        <div class="flex-grow min-w-0">
          <div class="flex justify-between items-start">
            <p class="text-sm font-medium text-gray-900 truncate">
              {{ activity.description || 'No description available' }}
            </p>
            <span class="text-xs text-gray-500">
              {{ formatTimestamp(activity.timestamp) }}
            </span>
          </div>

          <!-- Activity Details -->
          <div class="mt-1">
            <div v-if="activity.details" class="text-sm text-gray-600">
              <template v-if="activity.type === 'lesson_complete'">
                <p>Lesson: {{ activity.details.lesson_name || 'N/A' }}</p>
                <p>Accuracy: {{ activity.details.accuracy || 0 }}%</p>
              </template>
              <template v-else-if="activity.type === 'quiz_complete'">
                <p>Score: {{ activity.details.score || 0 }}%</p>
                <p>Status: {{ activity.details.passed ? 'Passed' : 'Failed' }}</p>
              </template>
            </div>
            <div v-if="activity.points_earned" class="mt-1 text-xs font-medium text-primary-600">
              +{{ activity.points_earned }} points earned
            </div>
          </div>
        </div>
      </div>

      <!-- Load More Button -->
      <button
        v-if="hasMore"
        @click="loadMore"
        class="w-full py-2 text-sm text-primary-600 hover:text-primary-700 font-medium"
        :disabled="loading"
      >
        {{ loading ? 'Loading...' : 'Load More' }}
      </button>
    </div>

    <!-- Empty State -->
    <div
      v-if="!activities?.length"
      class="text-center py-8 text-gray-500"
    >
      No activities yet. Start learning to see your progress!
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import {
  AcademicCapIcon,
  CheckCircleIcon,
  PencilSquareIcon,
  ClockIcon,
  StarIcon
} from '@heroicons/vue/24/outline';
import type { Activity } from '@/types/profile';
import { useProfileStore } from '@/stores/profile';

const props = defineProps<{
  activities?: Activity[];
}>();

const profileStore = useProfileStore();
const loading = ref(false);
const hasMore = ref(true);
const limit = ref(20);
const offset = ref(0);

const getActivityIcon = (type: string) => {
  const icons = {
    'lesson_complete': AcademicCapIcon,
    'quiz_complete': CheckCircleIcon,
    'profile_update': PencilSquareIcon,
    'daily_streak': ClockIcon,
    'achievement_earned': StarIcon
  };
  return icons[type as keyof typeof icons] || AcademicCapIcon;
};

const getActivityIconClass = (type: string) => {
  const baseClasses = 'p-2 rounded-full';
  const typeClasses = {
    'lesson_complete': 'bg-blue-100 text-blue-600',
    'quiz_complete': 'bg-green-100 text-green-600',
    'profile_update': 'bg-purple-100 text-purple-600',
    'daily_streak': 'bg-yellow-100 text-yellow-600',
    'achievement_earned': 'bg-primary-100 text-primary-600'
  };
  return `${baseClasses} ${typeClasses[type as keyof typeof typeClasses] || 'bg-gray-100 text-gray-600'}`;
};

const formatTimestamp = (timestamp: string) => {
  const date = new Date(timestamp);
  const now = new Date();
  const diff = (now.getTime() - date.getTime()) / 1000; // diff in seconds

  if (diff < 60) return 'just now';
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
  return date.toLocaleDateString();
};

const loadMore = async () => {
  if (loading.value) return;

  try {
    loading.value = true;
    await profileStore.fetchActivityFeed(limit.value, offset.value);
    offset.value += limit.value;
    if (profileStore.activityFeed?.activities.length < limit.value) {
      hasMore.value = false;
    }
  } finally {
    loading.value = false;
  }
};
</script>
