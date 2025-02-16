<template>
  <div class="level-card bg-white p-6 rounded-lg shadow" @click="$emit('select-level', level)">
    <h3 class="text-2xl font-bold mb-4">{{ level.name }}</h3>
    <p class="text-gray-600">{{ level.description }}</p>

    <div class="mt-4 flex justify-between items-center">
      <span>{{ progress?.completed_lessons || 0 }}/{{ progress?.total_lessons || 0 }} Lessons</span>
    </div>
    <button @click.stop="$emit('select-level', level)" class="mt-4 bg-primary-600 text-white rounded-md py-2 px-4 hover:bg-primary-700">
      Start Level
    </button>
  </div>
</template>

<script setup lang="ts">
import { defineProps, defineEmits, computed } from 'vue';
import type { Level, LevelProgress } from '@/types/lessons';

const props = defineProps<{
  level: Level;
  progress: LevelProgress | null;
}>();

const emit = defineEmits(['select-level']);
</script>

<style scoped>
.level-card {
  cursor: pointer;
  transition: transform 0.2s ease-in-out;
}

.level-card:hover {
  transform: scale(1.05);
}
</style>
