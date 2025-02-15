<template>
  <div class="bg-white rounded-lg shadow p-6">
    <div class="flex items-center justify-between mb-4">
      <div>
        <h1 class="text-2xl font-bold text-gray-900">{{ lesson?.title }}</h1>
        <p class="text-gray-600 mt-1">{{ lesson?.description }}</p>
      </div>
      <div class="flex items-center space-x-4">
        <router-link 
          :to="`/profile/level/${levelId}`"
          class="text-gray-600 hover:text-gray-900"
        >
          <ArrowLeftIcon class="w-6 h-6" />
        </router-link>
      </div>
    </div>

    <div class="grid grid-cols-3 gap-6">
  <QuickStat
    label="Status"
    :value="lesson?.completed ? 'Completed' : 'In Progress'"
    type="text"
    icon="DocumentTextIcon"
  />
  <QuickStat
    label="Points"
    :value="lesson?.completed ? '10' : '0'"
    icon="StarIcon"
    suffix=" pts"
  />
  <QuickStat
    label="Quiz"
    :value="quizStatus"
    type="text"
    icon="AcademicCapIcon"
  />
      <QuickStat
        label="Points Earned"
        :value="pointsEarned"
        icon="StarIcon"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { ArrowLeftIcon, DocumentTextIcon, AcademicCapIcon, StarIcon } from '@heroicons/vue/24/outline';
import type { Lesson } from '@/types/lessons';
import QuickStat from '@/components/profile/QuickStat.vue';

const props = defineProps<{
  lesson: Lesson | null;
  levelId: string;
}>();

const quizStatus = computed(() => {
  if (!props.lesson) return 'Not Available';
  if (props.lesson.completed) return 'Completed';
  if (props.lesson.progress.quiz_unlocked) return 'Available';
  return 'Locked';
});

const pointsEarned = computed(() => {
  if (!props.lesson) return 0;
  return props.lesson.progress.completed_flashcards * 10;
});
</script>
