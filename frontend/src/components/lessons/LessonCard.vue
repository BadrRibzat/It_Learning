<template>
  <div class="bg-white rounded-lg shadow-md overflow-hidden">
    <div class="relative pb-48">
      <img
        :src="lesson.thumbnail || 'https://via.placeholder.com/400x320.png?text=No+Image'"
        :alt="lesson.title"
        class="absolute h-full w-full object-cover"
      />
      <div
        class="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/60 to-transparent"
      >
        <h3 class="text-xl font-bold text-white">{{ lesson.title }}</h3>
        <p class="text-sm text-gray-200">{{ lesson.duration }} minutes</p>
      </div>
    </div>
    <div class="p-4">
      <div class="flex items-center justify-between mb-4">
        <div class="flex items-center">
          <span
            class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium"
            :class="difficultyClasses[lesson.difficulty]"
          >
            {{ $t(`lessons.difficulty.${lesson.difficulty}`) }}
          </span>
          <span class="ml-2 text-sm text-gray-500">
            {{ lesson.category }}
          </span>
        </div>
        <div class="flex items-center">
          <font-awesome-icon
            :icon="['fas', 'star']"
            class="text-yellow-400 w-4 h-4"
          />
          <span class="ml-1 text-sm text-gray-600">{{ lesson.rating }}/5</span>
        </div>
      </div>

      <p class="text-gray-600 text-sm mb-4 line-clamp-2">
        {{ lesson.description }}
      </p>

      <div class="flex items-center justify-between">
        <div class="flex items-center">
          <div class="relative" style="width: 150px">
            <div
              class="h-2 bg-gray-200 rounded-full overflow-hidden"
            >
              <div
                class="h-full bg-primary rounded-full"
                :style="{ width: `${completionPercentage}%` }"
              ></div>
            </div>
            <span class="text-xs text-gray-500 mt-1 block">
              {{ completionPercentage }}% {{ $t('lessons.completed') }}
            </span>
          </div>
        </div>
        <button
          @click="$router.push(`/lessons/${lesson.id}`)"
          class="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-primary hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
        >
          {{ completionPercentage > 0 ? $t('lessons.continue') : $t('lessons.start') }}
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue';
import { useProgress } from '@/composables/useProgress';

const props = defineProps({
  lesson: {
    type: Object,
    required: true,
  },
});

const { calculateLessonCompletion } = useProgress();
const completionPercentage = computed(() =>
  calculateLessonCompletion(props.lesson.id)
);

const difficultyClasses = {
  beginner: 'bg-green-100 text-green-800',
  intermediate: 'bg-yellow-100 text-yellow-800',
  advanced: 'bg-red-100 text-red-800',
};
</script>
