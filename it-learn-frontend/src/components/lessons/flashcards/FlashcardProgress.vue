<template>
  <div class="flashcard-progress space-y-4 bg-white rounded-lg shadow p-6">
    <div class="flex items-center justify-between">
      <div class="flex items-center space-x-4">
        <div class="text-sm font-medium text-gray-900">
          Card {{ currentIndex + 1 }} of {{ total }}
        </div>
        
        <div class="flex items-center space-x-2">
          <CheckCircleIcon 
            v-if="correctAnswers > 0"
            class="w-5 h-5 text-green-500" 
          />
          <span class="text-sm text-green-600">
            {{ correctAnswers }} correct
          </span>
        </div>

        <div v-if="streak > 2" class="flex items-center space-x-1">
          <FireIcon class="w-5 h-5 text-orange-500" />
          <span class="text-sm text-orange-600">
            {{ streak }} streak
          </span>
        </div>
      </div>

      <div class="flex items-center space-x-2">
        <StarIcon class="w-5 h-5 text-yellow-500" />
        <span class="text-sm font-medium text-gray-900">
          {{ points }} points
        </span>
      </div>
    </div>

    <div class="space-y-2">
      <div class="flex justify-between text-sm text-gray-600">
        <span>Progress</span>
        <span>{{ completionPercentage }}%</span>
      </div>
      
      <ProgressBar
        :value="currentIndex + 1"
        :max="total"
        class="mb-2"
      />

      <div class="flex justify-between text-sm text-gray-600">
        <span>Accuracy</span>
        <span>{{ accuracy }}%</span>
      </div>
    </div>

    <div class="grid grid-cols-10 gap-1">
      <div 
        v-for="index in total" 
        :key="index"
        class="h-1.5 rounded transition-all duration-300"
        :class="getProgressIndicatorClass(index - 1)"
      />
    </div>

    <div v-if="completionPercentage === 100" 
         class="mt-4 p-4 bg-green-50 rounded-lg">
      <div class="flex items-center justify-between">
        <div class="text-green-800">
          <h4 class="font-medium">All flashcards completed!</h4>
          <p class="text-sm">
            Final Score: {{ accuracy }}% accuracy, {{ points }} points earned
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, watch } from 'vue';
import { useNotificationStore } from '@/stores/notification';
import { useProfileStore } from '@/stores/profile';
import { CheckCircleIcon, StarIcon, FireIcon } from '@heroicons/vue/24/solid';
import ProgressBar from '@/components/lessons/common/ProgressBar.vue';

const props = defineProps<{
  currentIndex: number;
  total: number;
  correctAnswers: number;
  points: number;
  answeredCards: boolean[];
  streakCount?: number;
}>();

const notificationStore = useNotificationStore();
const profileStore = useProfileStore();

const completionPercentage = computed(() => 
  Math.round((props.currentIndex + 1) / props.total * 100)
);

const accuracy = computed(() => 
  Math.round((props.correctAnswers / (props.currentIndex + 1)) * 100) || 0
);

const streak = computed(() => props.streakCount || 0);

const milestones = [
  { threshold: 25, message: '25% Complete!' },
  { threshold: 50, message: 'Halfway there!' },
  { threshold: 75, message: 'Almost done!' },
  { threshold: 100, message: 'Completed!' }
];

const getProgressIndicatorClass = (index: number) => {
  if (index > props.currentIndex) return 'bg-gray-200';
  if (!props.answeredCards[index]) return 'bg-gray-400';
  return props.answeredCards[index] ? 'bg-green-500' : 'bg-red-500';
};

const checkMilestones = async () => {
  const currentPercentage = completionPercentage.value;
  const milestone = milestones.find(m => m.threshold === currentPercentage);

  if (milestone) {
    notificationStore.success(milestone.message);
    
    if (currentPercentage === 100) {
      await profileStore.trackActivity('flashcards_completed', {
        accuracy: accuracy.value,
        points_earned: props.points
      });
    }
  }

  if (streak.value > 0 && streak.value % 5 === 0) {
    notificationStore.success(`${streak.value} correct answers in a row! 🔥`);
    await profileStore.checkAchievements('streak_milestone');
  }
};

watch(() => props.currentIndex, async () => {
  await checkMilestones();
});

onMounted(() => {
  checkMilestones();
});
</script>

<style scoped>
.flashcard-progress {
  transition: all 0.3s ease-in-out;
}

.grid-cols-10 > div {
  transition: background-color 0.3s ease-in-out;
}

@keyframes celebrate {
  0%, 100% { transform: scale(1); }
  50% { transform: scale(1.05); }
}

.celebration-animation {
  animation: celebrate 0.5s ease-in-out;
}
</style>
