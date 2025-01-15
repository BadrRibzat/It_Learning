<template>
  <div class="bg-white rounded-lg shadow-md p-6">
    <h2 class="text-2xl font-bold mb-2">{{ level.name }}</h2>
    <p class="text-gray-600 mb-4">{{ level.description }}</p>
    <div class="flex items-center justify-between">
      <div class="text-sm text-gray-500">
        {{ completedLessons }} / {{ totalLessons }} lessons completed
      </div>
      <router-link
        :to="{ name: 'LevelDetail', params: { levelId: level.id } }"
        class="inline-block bg-primary text-white px-4 py-2 rounded-md hover:bg-primary-dark"
      >
        Start Learning
      </router-link>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue';
import { useStore } from 'vuex';

const props = defineProps({
  level: {
    type: Object,
    required: true,
  },
});

const store = useStore();

const userProgress = computed(() => store.getters['progress/userProgress']);

const completedLessons = computed(() => {
  return userProgress.value?.levels?.[props.level.id]?.completed_lessons || 0;
});

const totalLessons = computed(() => props.level.total_lessons || 0);
</script>
